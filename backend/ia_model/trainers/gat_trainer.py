import torch
import torch.nn.functional as F
from torch_geometric.datasets import Planetoid
from torch_geometric.nn import GATv2Conv
import io
from contextlib import redirect_stdout

# Chargement du dataset
dataset = Planetoid(root=".", name="Cora")
data = dataset[0]

class GAT(torch.nn.Module):
    def __init__(self, dim_in, dim_g, dim_h, dim_out, heads1=8, heads2=8, heads3=1):
        super().__init__()
        self.gat1 = GATv2Conv(dim_in, dim_g, heads=heads1)
        self.gat2 = GATv2Conv(dim_g * heads1, dim_h, heads=heads2)
        self.gat3 = GATv2Conv(dim_h * heads2, dim_out, heads=heads3)
        self.optimizer = torch.optim.Adam(self.parameters(), lr=0.005, weight_decay=5e-4)

    def forward(self, x, edge_index):
        x = F.dropout(x, p=0.6, training=self.training)
        x = self.gat1(x, edge_index)
        x = F.elu(x)
        x = F.dropout(x, p=0.6, training=self.training)
        x = self.gat2(x, edge_index)
        x = F.elu(x)
        x = F.dropout(x, p=0.6, training=self.training)
        x = self.gat3(x, edge_index)
        return x, F.log_softmax(x, dim=1)

def accuracy(pred_y, y):
    return ((pred_y == y).sum() / len(y)).item()

def train(model, data, epochs=200, patience=30):
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = model.optimizer
    best_val_loss = float('inf')
    patience_counter = 0

    model.train()
    for epoch in range(epochs+1):
        optimizer.zero_grad()
        _, out = model(data.x, data.edge_index)
        loss = criterion(out[data.train_mask], data.y[data.train_mask])
        loss.backward()
        optimizer.step()

        val_loss = criterion(out[data.val_mask], data.y[data.val_mask])
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
        else:
            patience_counter += 1
        if patience_counter == patience:
            print(f"Stopping early at epoch {epoch}")
            break

        if epoch % 10 == 0:
            train_acc = accuracy(out[data.train_mask].argmax(dim=1), data.y[data.train_mask])
            val_acc = accuracy(out[data.val_mask].argmax(dim=1), data.y[data.val_mask])
            print(f'Epoch {epoch:>3} | Train Loss: {loss:.3f} | Train Acc: {train_acc*100:.2f}% | '
                  f'Val Loss: {val_loss:.2f} | Val Acc: {val_acc*100:.2f}%')

    return model

def test(model, data):
    model.eval()
    _, out = model(data.x, data.edge_index)
    test_acc = accuracy(out[data.test_mask].argmax(dim=1), data.y[data.test_mask])
    print(f"Test Accuracy: {test_acc*100:.2f}%")
    return test_acc

def run_gat():
    buffer = io.StringIO()
    with redirect_stdout(buffer):
        model = GAT(dataset.num_features, 8, 16, dataset.num_classes)
        train(model, data)
        acc = test(model, data)

    return {
        "model": "GAT",
        "accuracy": f"{acc*100:.2f}%",
        "log": buffer.getvalue(),
        "parameters": {
            "layers": 3,
            "dataset_size": data.x.shape[0]
        }
    }

