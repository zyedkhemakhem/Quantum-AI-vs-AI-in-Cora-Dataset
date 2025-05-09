import { useState } from 'react';
import RunnerButtons from '../components/RunnerButtons';
import VisualizationButtons from '../components/VisualizationButtons';
import TrainingResults from '../components/TrainingResults';
import Visualizations from '../components/Visualizations';
import LogoutButton from '../components/LogoutButton';
import '../styles/UserPage.css'; 


function UserPage() {
  const [hasTrained, setHasTrained] = useState(false);
  const [output, setOutput] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState({});

  const handleTrain = async (model) => {
    setHasTrained(true);
    setLoading(true);
    setOutput('');
    setAccuracy('');
    setImages({});

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/train/?model=${model}`);
      const data = await response.json();
      setAccuracy(data.accuracy);
      setOutput(data.log);
    } catch (error) {
      setOutput('Erreur lors de l’appel à l’API');
    } finally {
      setLoading(false);
    }
  };

  const fetchVisualBefore = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/visualize/before/');
      const data = await res.json();
      setImages({
        graph: `data:image/png;base64,${data.graph}`,
        degrees: `data:image/png;base64,${data.degrees}`,
      });
    } catch (e) {
      alert('Erreur visualisation avant entraînement');
    } finally {
      setLoading(false);
    }
  };

  const fetchVisualAfter = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/visualize/after/');
      const data = await res.json();
      setImages({
        tsne_before: `data:image/png;base64,${data.tsne_before}`,
        tsne_after: `data:image/png;base64,${data.tsne_after}`,
        accuracy_degree: `data:image/png;base64,${data.accuracy_degree}`,
      });
    } catch (e) {
      alert('Erreur visualisation après entraînement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-container">
      <h1>🧪 Interface Utilisateur</h1>
      <div className='card-section'>
      <RunnerButtons onTrain={handleTrain} loading={loading} className="button-group" />
      <VisualizationButtons onBefore={fetchVisualBefore} onAfter={fetchVisualAfter} loading={loading} hasTrained={hasTrained} />
      <TrainingResults accuracy={accuracy} parameters={null} output={output} />
      <Visualizations images={images} className='visualization-image'/>
      </div>
      <div className="description-section">
      <h2>📘 Modèles GNN Présentés</h2>
      <ul>
        <li><strong>GCN</strong> : Graph Convolutional Network de base pour l’apprentissage semi-supervisé sur des graphes.</li>
        <li><strong>GAT</strong> : Utilise des mécanismes d’attention pour pondérer dynamiquement les voisins dans les graphes.</li>
        <li><strong>GCN AUG</strong> : Variante du GCN entraînée sur une version augmentée du dataset Cora.</li>
        <li><strong>GAT AUG</strong> : GAT appliqué au dataset Cora avec des techniques d’augmentation de données.</li>
        <li><strong>QGCN</strong> : GCN quantifié pour une meilleure efficacité mémoire et de calcul.</li>
        <li><strong>QGAT</strong> : GAT quantifié pour réduire la complexité tout en conservant les performances.</li>
        <li><strong>QGCN AUG</strong> : Version quantifiée de GCN sur dataset Cora augmenté.</li>
        <li><strong>QGAT AUG</strong> : Version quantifiée de GAT sur dataset Cora augmenté.</li>
      </ul>
    </div>

    <div className="description-section">
      <h2>🗂️ Description des Datasets</h2>
      <ul>
        <li><strong>Cora</strong> : Dataset classique de citation académique utilisé en apprentissage de graphes. Il contient des articles (nœuds) et des citations (arêtes), avec des étiquettes de catégories.</li>
        <li><strong>Cora Augmenté</strong> : Version enrichie de Cora avec des techniques d’augmentation (ajout/suppression d’arêtes, masquage de caractéristiques) pour tester la robustesse des modèles.</li>
      </ul>
    </div>

    <div className="description-section">
    <h2>🎯 Objectif de l’Entraînement</h2>
    <p>
      Le but de l’entraînement de ces modèles GNN (Graph Neural Networks) est de permettre au modèle d’apprendre les représentations des nœuds dans un graphe en exploitant la structure du graphe et les caractéristiques des nœuds.<br/><br/>
      Concrètement, il s’agit de prédire la catégorie (ou le sujet) d’un article scientifique à partir de ses connexions (citations) dans le réseau Cora.<br/><br/>
      <strong>Résultat attendu :</strong><br/>
      - Obtenir une précision élevée sur les données de test.<br/>
      - Observer une séparation claire des classes dans les visualisations (TSNE, Spring Layout).<br/>
      - Évaluer la robustesse et la performance de différentes variantes de GNN, classiques et quantifiées, avec ou sans augmentation de données.
    </p>
    </div>


    <div className="description-section">
      <h2>📈 Résultat Attendu – Définitions des Termes</h2>
      <ul>
        <li><strong>Epoch</strong> : Une passe complète sur l’ensemble du dataset d’entraînement.</li>
        <li><strong>Train Loss</strong> : Erreur moyenne du modèle sur les données d’entraînement pendant l’epoch.</li>
        <li><strong>Train Acc</strong> : Précision du modèle sur les données d’entraînement (en %).</li>
        <li><strong>Val Loss</strong> : Erreur du modèle sur les données de validation (non vues pendant l’apprentissage).</li>
        <li><strong>Val Acc</strong> : Précision sur les données de validation, mesure la généralisation.</li>
        <li><strong>Test Accuracy</strong> : Précision finale mesurée sur l’ensemble de test.</li>
      </ul>
    </div>

  <div className="description-section">
    <h2>🕸️ Visualisation du Graphe Cora</h2>
    <p>
      Output : Visualisation graphique du réseau de citations Cora.<br/><br/>
      Chaque nœud représente un article.<br/>
      Chaque arête représente une citation entre deux articles.<br/>
      Les nœuds ont différentes couleurs selon leur sujet de recherche.<br/>
      La disposition du graphe est générée selon l’algorithme Spring Layout.
    </p>
  </div>

  <div className="description-section">
    <h2>📊 Distribution des Degrés des Nœuds</h2>
    <p>
      Cette visualisation analyse la distribution des connexions (degrés) dans le graphe Cora.<br/><br/>
      Le <strong>degré</strong> d’un nœud correspond au nombre d’arêtes qui lui sont liées.<br/><br/>
      <strong>Output</strong> : un histogramme où :<br/>
      - L’axe X représente le degré (nombre de connexions).<br/>
      - L’axe Y représente combien de nœuds ont ce degré.<br/><br/>
      Observation : Le graphe suit une loi de puissance —<br/>
      ➤ Beaucoup de nœuds ont peu de connexions.<br/>
      ➤ Peu de nœuds (hubs) sont très connectés.
    </p>
  </div>

  <LogoutButton className="logout-button" />

  </div>
  );
}

export default UserPage;