import torch
from torch_geometric.datasets import Planetoid
from torch_geometric.transforms import NormalizeFeatures
import pandas as pd
import os
from torch_geometric.data import Data
import random
import numpy as np

DEST_DIR = "CoraAugmented"
os.makedirs(DEST_DIR, exist_ok=True)

dataset = Planetoid(root="Cora", name="Cora", transform=NormalizeFeatures())
data = dataset[0]

original_features = data.x
original_labels = data.y
original_edges = data.edge_index.T  
TARGET_NODES = 50000
num_to_generate = TARGET_NODES - original_features.shape[0]

print(f"🔧 Mixup : génération de {num_to_generate} nœuds supplémentaires...")

new_features = []
new_labels = []
new_edges = []

for i in range(num_to_generate):
    i1, i2 = random.sample(range(original_features.shape[0]), 2)
    lam = random.random()
    x_new = lam * original_features[i1] + (1 - lam) * original_features[i2]
    y_new = original_labels[i1] if lam >= 0.5 else original_labels[i2]

    new_features.append(x_new)
    new_labels.append(y_new)

    target = original_edges[random.randint(0, len(original_edges) - 1)][0].item()
    new_node_index = original_features.shape[0] + i
    new_edges.append([new_node_index, target])
    new_edges.append([target, new_node_index])

new_features = torch.stack(new_features)
new_labels = torch.tensor(new_labels, dtype=torch.long)
new_edges = torch.tensor(new_edges, dtype=torch.long)

all_features = torch.cat([original_features, new_features], dim=0)
all_labels = torch.cat([original_labels, new_labels], dim=0)
all_edges = torch.cat([original_edges, new_edges], dim=0)

num_nodes = all_features.shape[0]
indices = np.random.permutation(num_nodes)

train_size = int(0.6 * num_nodes)
val_size = int(0.2 * num_nodes)

train_mask = np.zeros(num_nodes, dtype=bool)
val_mask = np.zeros(num_nodes, dtype=bool)
test_mask = np.zeros(num_nodes, dtype=bool)

train_mask[indices[:train_size]] = True
val_mask[indices[train_size:train_size+val_size]] = True
test_mask[indices[train_size+val_size:]] = True

print(f"💾 Sauvegarde dans : {DEST_DIR}/")

pd.DataFrame(all_features.numpy()).to_csv(os.path.join(DEST_DIR, "cora_features.csv"), index=False)
pd.DataFrame({"label": all_labels.numpy()}).to_csv(os.path.join(DEST_DIR, "cora_labels.csv"), index=False)
pd.DataFrame(all_edges.numpy(), columns=["source", "target"]).to_csv(os.path.join(DEST_DIR, "cora_edges.csv"), index=False)
pd.DataFrame({
    "train_mask": train_mask,
    "val_mask": val_mask,
    "test_mask": test_mask,
}).to_csv(os.path.join(DEST_DIR, "cora_masks.csv"), index=False)

print(f"✅ Dataset Cora augmenté enregistré avec succès dans '{DEST_DIR}' avec masques.")
