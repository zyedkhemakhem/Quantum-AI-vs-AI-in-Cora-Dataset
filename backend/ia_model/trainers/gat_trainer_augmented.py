import torch
import torch.nn.functional as F
from torch_geometric.data import Data
from torch_geometric.nn import GATv2Conv
import pandas as pd
import io
from contextlib import redirect_stdout
import os

def load_augmented_cora():
    base = os.path.join(os.path.dirname(__file__), "CoraAugmented")
    x = torch.tensor(pd.read_csv(os.path.join(base, "cora_features.csv")).values, dtype=torch.float)
    y = torch.tensor(pd.read_csv(os.path.join(base, "cora_labels.csv"))["label"].values, dtype=torch.long)
    edge_index = torch.tensor(pd.read_csv(os.path.join(base, "cora_edges.csv")).values.T, dtype=torch.long)
    masks = pd.read_csv(os.path.join(base, "cora_masks.csv"))
    train_mask = torch.tensor(masks["train_mask"].values, dtype=torch.bool)
    val_mask   = torch.tensor(masks["val_mask"].values,   dtype=torch.bool)
    test_mask  = torch.tensor(masks["test_mask"].values,  dtype=torch.bool)
    return Data(x=x, y=y, edge_index=edge_index,
                train_mask=train_mask, val_mask=val_mask, test_mask=test_mask)

class GAT(torch.nn.Module):
    def __init__(self, dim_in, dim_g, dim_h, dim_out, heads1=8, heads2=8, heads3=1):
        super().__init__()
        self.gat1 = GATv2Conv(dim_in, dim_g, heads=heads1)
        self.gat2 = GATv2Conv(dim_g * heads1, dim_h, heads=heads2)
        self.gat3 = GATv2Conv(dim_h * heads2, dim_out, heads=heads3)
        self.optimizer = torch.optim.Adam(self.parameters(), lr=0.005, weight_decay=5e-4)

    def forward(self, x, edge_index):
        x = F.dropout(x, 0.6, training=self.training)
        x = F.elu(self.gat1(x, edge_index))
        x = F.dropout(x, 0.6, training=self.training)
        x = F.elu(self.gat2(x, edge_index))
        x = F.dropout(x, 0.6, training=self.training)
        x = self.gat3(x, edge_index)
        return x, F.log_softmax(x, dim=1)

def accuracy(pred_y, y):
    return ((pred_y == y).sum() / len(y)).item()

def train(model, data, epochs=200, patience=30):
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = model.optimizer
    best_val = float('inf')
    patience_cnt = 0

    model.train()
    for epoch in range(epochs + 1):
        optimizer.zero_grad()
        _, out = model(data.x, data.edge_index)
        loss = criterion(out[data.train_mask], data.y[data.train_mask])
        loss.backward()
        optimizer.step()

        val_loss = criterion(out[data.val_mask], data.y[data.val_mask])
        if val_loss < best_val:
            best_val = val_loss
            patience_cnt = 0
        else:
            patience_cnt += 1
            if patience_cnt == patience:
                print(f"Early stop at epoch {epoch}")
                break

        if epoch % 10 == 0:
            tr_acc = accuracy(out[data.train_mask].argmax(dim=1), data.y[data.train_mask])
            v_acc  = accuracy(out[data.val_mask].argmax(dim=1), data.y[data.val_mask])
            print(f"Epoch {epoch:>3} | Loss: {loss:.3f} | Train Acc: {tr_acc*100:.2f}% | Val Acc: {v_acc*100:.2f}%")

    return model

def test(model, data):
    model.eval()
    _, out = model(data.x, data.edge_index)
    test_acc = accuracy(out[data.test_mask].argmax(dim=1), data.y[data.test_mask])
    print(f"Test Acc: {test_acc*100:.2f}%")
    return test_acc

def run_gat_augmented():
    data = load_augmented_cora()
    buf = io.StringIO()
    with redirect_stdout(buf):
        model = GAT(data.num_node_features, 8, 16, int(data.y.max().item()) + 1)
        train(model, data)
        acc = test(model, data)
    return {
        "model": "GAT (augmented)",
        "accuracy": f"{acc*100:.2f}%",
        "log": buf.getvalue(),
        "parameters": {"layers": 3, "dataset_size": data.num_nodes}
    }
