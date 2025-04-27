import matplotlib.pyplot as plt
import io
import base64
import numpy as np
from sklearn.manifold import TSNE
from torch_geometric.utils import degree
from ..trainers.gat_trainer import dataset, data, GAT, train, test, accuracy

def plot_tsne_before_training():
    model = GAT(dataset.num_features, 8, 16, dataset.num_classes)
    h, _ = model(data.x, data.edge_index)

    return _tsne_plot(h, data.y)

def plot_tsne_after_training():
    model = GAT(dataset.num_features, 8, 16, dataset.num_classes)
    train(model, data)
    h, _ = model(data.x, data.edge_index)

    return _tsne_plot(h, data.y)

def plot_accuracy_by_degree():
    model = GAT(dataset.num_features, 8, 16, dataset.num_classes)
    train(model, data)
    _, out = model(data.x, data.edge_index)

    degs = degree(data.edge_index[0]).numpy()
    accuracies = []
    sizes = []

    for i in range(6):
        mask = np.where(degs == i)[0]
        accuracies.append(accuracy(out.argmax(dim=1)[mask], data.y[mask]))
        sizes.append(len(mask))

    mask = np.where(degs > 5)[0]
    accuracies.append(accuracy(out.argmax(dim=1)[mask], data.y[mask]))
    sizes.append(len(mask))

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlabel('Node degree')
    ax.set_ylabel('Accuracy score')
    plt.bar(['0','1','2','3','4','5','>5'], accuracies, color='#0A047A')

    for i in range(7):
        plt.text(i, accuracies[i], f'{accuracies[i]*100:.2f}%', ha='center', color='#0A047A')
        plt.text(i, accuracies[i]//2, sizes[i], ha='center', color='white')

    return _fig_to_base64()

def _tsne_plot(h, labels):
    tsne = TSNE(n_components=2, learning_rate='auto', init='pca').fit_transform(h.detach())
    plt.figure(figsize=(10, 10))
    plt.axis('off')
    plt.scatter(tsne[:, 0], tsne[:, 1], s=50, c=labels)
    return _fig_to_base64()

def _fig_to_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')
