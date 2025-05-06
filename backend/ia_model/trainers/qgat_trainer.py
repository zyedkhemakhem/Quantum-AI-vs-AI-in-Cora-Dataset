import torch
import torch.nn.functional as F
from torch_geometric.datasets import Planetoid
from torch_geometric.transforms import NormalizeFeatures
from torch_geometric.nn import GATv2Conv
import io
from contextlib import redirect_stdout

dataset = Planetoid(root=".", name="Cora", transform=NormalizeFeatures())
data = dataset[0]

class QGAT(torch.nn.Module):
    def __init__(self, in_dim, h_dim, out_dim):
        super().__init__()
        self.gat1 = GATv2Conv(in_dim, h_dim, heads=4, concat=True)
        self.gat2 = GATv2Conv(h_dim * 4, out_dim, heads=1, concat=False)
        self.optimizer = torch.optim.Adam(self.parameters(), lr=0.005, weight_decay=1e-3)

    def forward(self, x, edge_index):
        x = torch.tanh(self.gat1(x, edge_index))
        x = self.gat2(x, edge_index)
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

def run_qgat():
    buf = io.StringIO()
    with redirect_stdout(buf):
        model = QGAT(dataset.num_features, 64, dataset.num_classes)
        train(model, data)
        acc = test(model, data)
    return {
        "model": "QGAT",
        "accuracy": f"{acc*100:.2f}%",
        "log": buf.getvalue(),
        "parameters": {"layers": 2, "dataset_size": data.num_nodes}
    }
