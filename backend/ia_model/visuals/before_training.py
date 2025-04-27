import matplotlib.pyplot as plt
import networkx as nx
import io
import base64
from collections import Counter
from torch_geometric.utils import to_networkx, degree
from ..trainers.gcn_trainer import data

def plot_graph():
    G = to_networkx(data, to_undirected=True)
    plt.figure(figsize=(10, 10))
    plt.axis('off')
    nx.draw_networkx(G,
                     pos=nx.spring_layout(G, seed=0),
                     with_labels=False,
                     node_size=50,
                     node_color=data.y,
                     width=2,
                     edge_color="grey")

    return _fig_to_base64()

def plot_node_degrees():
    degrees_list = degree(data.edge_index[0]).numpy()
    numbers = Counter(degrees_list)

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.set_xlabel('Node degree')
    ax.set_ylabel('Number of nodes')
    plt.bar(numbers.keys(), numbers.values(), color='#0A047A')

    return _fig_to_base64()

def _fig_to_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')
