import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv
from torch_geometric.data import Data
import pandas as pd
import io
from contextlib import redirect_stdout

def load_local_cora():
    features = torch.tensor(pd.read_csv("cora_features.csv").values, dtype=torch.float)
    labels = torch.tensor(pd.read_csv("cora_labels.csv")["label"].values, dtype=torch.long)
    edges = torch.tensor(pd.read_csv("cora_edges.csv").values.T, dtype=torch.long)
    masks_df = pd.read_csv("cora_masks.csv")

    train_mask = torch.tensor(masks_df["train_mask"].values, dtype=torch.bool)
    val_mask = torch.tensor(masks_df["val_mask"].values, dtype=torch.bool)
    test_mask = torch.tensor(masks_df["test_mask"].values, dtype=torch.bool)

    return Data(x=features, y=labels, edge_index=edges,
                train_mask=train_mask, val_mask=val_mask, test_mask=test_mask)

def augment_data_with_epsilon(data, num_augments=3, epsilon=0.01):
    augmented_x = [data.x]
    augmented_y = [data.y]
    train_mask_list = [data.train_mask]
    val_mask_list = [data.val_mask]
    test_mask_list = [data.test_mask]
    edge_index_list = [data.edge_index]

    num_nodes = data.x.shape[0]

    for i in range(num_augments):
        noise = torch.randn_like(data.x) * epsilon
        x_aug = data.x + noise
        augmented_x.append(x_aug)
        augmented_y.append(data.y.clone())
        train_mask_list.append(data.train_mask.clone())
        val_mask_list.append(data.val_mask.clone())
        test_mask_list.append(data.test_mask.clone())

        edge_offset = data.edge_index + num_nodes * (i + 1)
        edge_index_list.append(edge_offset)

    x_combined = torch.cat(augmented_x, dim=0)
    y_combined = torch.cat(augmented_y, dim=0)
    train_mask_combined = torch.cat(train_mask_list, dim=0)
    val_mask_combined = torch.cat(val_mask_list, dim=0)
    test_mask_combined = torch.cat(test_mask_list, dim=0)
    edge_index_combined = torch.cat(edge_index_list, dim=1)

    return Data(x=x_combined, y=y_combined, edge_index=edge_index_combined,
                train_mask=train_mask_combined, val_mask=val_mask_combined, test_mask=test_mask_combined)

def drop_edges(data, drop_rate=0.1):
    num_edges = data.edge_index.shape[1]
    num_keep = int((1 - drop_rate) * num_edges)
    perm = torch.randperm(num_edges)[:num_keep]
    edge_index_dropped = data.edge_index[:, perm]

    return Data(x=data.x.clone(), y=data.y.clone(), edge_index=edge_index_dropped,
                train_mask=data.train_mask.clone(), val_mask=data.val_mask.clone(), test_mask=data.test_mask.clone())

def mixup_nodes(data, num_mix=30000):
    x_mix = []
    y_mix = []
    for _ in range(num_mix):
        i, j = torch.randint(0, data.x.shape[0], (2,))
        lam = torch.rand(1).item()
        x_new = lam * data.x[i] + (1 - lam) * data.x[j]
        y_new = data.y[i] if lam > 0.5 else data.y[j]

        x_mix.append(x_new)
        y_mix.append(y_new)

    x_mix = torch.stack(x_mix)
    y_mix = torch.tensor(y_mix)

    data.x = torch.cat([data.x, x_mix], dim=0)
    data.y = torch.cat([data.y, y_mix], dim=0)

    N = x_mix.shape[0]
    false_mask = torch.zeros(N, dtype=torch.bool)
    data.train_mask = torch.cat([data.train_mask, false_mask], dim=0)
    data.val_mask = torch.cat([data.val_mask, false_mask], dim=0)
    data.test_mask = torch.cat([data.test_mask, false_mask], dim=0)

    return data

class GCN(torch.nn.Module):
    def __init__(self, dim_in, dim_g, dim_h, dim_out):
        super().__init__()
        self.gcn1 = GCNConv(dim_in, dim_g)
        self.gcn2 = GCNConv(dim_g, dim_h)
        self.gcn3 = GCNConv(dim_h, dim_out)
        self.optimizer = torch.optim.Adam(self.parameters(), lr=0.01, weight_decay=1e-3)

    def forward(self, x, edge_index):
        x = F.dropout(x, p=0.6, training=self.training)
        x = self.gcn1(x, edge_index)
        x = torch.relu(x)
        x = F.dropout(x, p=0.6, training=self.training)
        x = self.gcn2(x, edge_index)
        x = torch.relu(x)
        x = F.dropout(x, p=0.6, training=self.training)
        x = self.gcn3(x, edge_index)
        return x, F.log_softmax(x, dim=1)

def accuracy(pred_y, y):
    return ((pred_y == y).sum() / len(y)).item()

def train(model, data, epochs=200, patience=None):
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = model.optimizer

    model.train()
    for epoch in range(epochs + 1):
        optimizer.zero_grad()
        _, out = model(data.x, data.edge_index)
        loss = criterion(out[data.train_mask], data.y[data.train_mask])
        loss.backward()
        optimizer.step()

        val_loss = criterion(out[data.val_mask], data.y[data.val_mask])

        if epoch % 10 == 0:
            train_acc = accuracy(out[data.train_mask].argmax(dim=1), data.y[data.train_mask])
            val_acc = accuracy(out[data.val_mask].argmax(dim=1), data.y[data.val_mask])
            print(f'Epoch {epoch:>3} | Train Loss: {loss:.3f} | Train Acc: {train_acc*100:.2f}% | '
                  f'Val Loss: {val_loss:.2f} | Val Acc: {val_acc*100:.2f}%')


def test(model, data):
    model.eval()
    _, out = model(data.x, data.edge_index)
    test_acc = accuracy(out[data.test_mask].argmax(dim=1), data.y[data.test_mask])
    print(f"Test Accuracy: {test_acc*100:.2f}%")
    return test_acc

def run_gcn_large_mix():
    data = load_local_cora()

    data = augment_data_with_epsilon(data, num_augments=1, epsilon=0.01)

    data = mixup_nodes(data, num_mix=90000) 

    print(f"Taille du dataset après augmentation : {data.x.shape[0]} nœuds")

    model = GCN(data.num_features, 256, 128, int(data.y.max().item()) + 1)
    train(model, data, epochs=200, patience=None)
    acc = test(model, data)

    return {
        "model": "GCN (Mixup massif)",
        "accuracy": f"{acc*100:.2f}%",
        "parameters": {
            "dataset_size": data.x.shape[0]
        }
    }


if __name__ == "__main__":
    result = run_gcn_large_mix()
    print("Résultat du modèle GCN :")
    print(f"Modèle       : {result['model']}")
    print(f"Précision    : {result['accuracy']}")
    print(f"Paramètres   : {result['parameters']}")

