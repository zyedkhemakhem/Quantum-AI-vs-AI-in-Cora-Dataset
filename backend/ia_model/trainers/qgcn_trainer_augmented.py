import torch
import torch.nn.functional as F
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
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

class QGCN(torch.nn.Module):
    def __init__(self, in_dim, h_dim, out_dim):
        super().__init__()
        self.conv1 = GCNConv(in_dim, h_dim)
        self.conv2 = GCNConv(h_dim, h_dim)
        self.linear = torch.nn.Linear(h_dim, out_dim)
        self.optimizer = torch.optim.Adam(self.parameters(), lr=0.005, weight_decay=1e-3)

    def forward(self, x, edge_index):
        x = torch.tanh(self.conv1(x, edge_index))
        x = torch.tanh(self.conv2(x, edge_index))
        x = self.linear(x)
        return x, F.log_softmax(x, dim=1)

def accuracy(pred, y):
    return (pred == y).sum().item() / len(y)

def train(model, data, epochs=100):
    opt = model.optimizer
    loss_fn = torch.nn.CrossEntropyLoss()
    for epoch in range(epochs):
        model.train()
        opt.zero_grad()
        _, out = model(data.x, data.edge_index)
        loss = loss_fn(out, data.y)
        loss.backward()
        opt.step()
        if epoch % 10 == 0:
            acc = accuracy(out.argmax(dim=1), data.y)
            print(f"Epoch {epoch} | Acc: {acc:.4f}")

def test(model, data):
    model.eval()
    _, out = model(data.x, data.edge_index)
    acc = accuracy(out.argmax(dim=1), data.y)
    print(f"Test Acc: {acc*100:.2f}%")
    return acc

def run_qgcn_augmented():
    data = load_augmented_cora()
    buf = io.StringIO()
    with redirect_stdout(buf):
        model = QGCN(data.num_node_features, 64, int(data.y.max().item())+1)
        train(model, data)
        acc = test(model, data)
    return {
        "model": "QGCN (augmented)",
        "accuracy": f"{acc*100:.2f}%",
        "log": buf.getvalue(),
        "parameters": {"layers": 3, "dataset_size": data.num_nodes}
    }
