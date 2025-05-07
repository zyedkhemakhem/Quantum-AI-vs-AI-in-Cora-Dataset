import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import RunnerButtons from '../components/RunnerButtons';
import VisualizationButtons from '../components/VisualizationButtons';
import TrainingResults from '../components/TrainingResults';
import Visualizations from '../components/Visualizations';
import LogoutButton from "../components/LogoutButton";
import '../styles/UserPage.css'; // Réutilisation du style utilisateur

function DeveloperPage() {
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
    } catch {
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
    } catch {
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
    } catch {
      alert('Erreur visualisation après entraînement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-container">
      <LogoutButton />
      <h1>💻 Interface Développeur — Édition des Trainers</h1>

      <RunnerButtons onTrain={handleTrain} loading={loading} />
      <VisualizationButtons
        onBefore={fetchVisualBefore}
        onAfter={fetchVisualAfter}
        loading={loading}
        hasTrained={hasTrained}
      />
      <TrainingResults accuracy={accuracy} output={output} />
      <Visualizations images={images} />

      <h2>📝 Modifier les scripts</h2>
      <CodeEditor title="gcn_trainer.py" apiEndpoint="http://127.0.0.1:8000/api/code/update/gcn/" />
      <CodeEditor title="gat_trainer.py" apiEndpoint="http://127.0.0.1:8000/api/code/update/gat/" />
      <CodeEditor title="gcn_trainer_augmented.py" apiEndpoint="http://127.0.0.1:8000/api/code/update/gcn_augmented/" />
      <CodeEditor title="gat_trainer_augmented.py" apiEndpoint="http://127.0.0.1:8000/api/code/update/gat_augmented/" />
      <CodeEditor title="qgcn_trainer.py" apiEndpoint="http://127.0.0.1:8000/api/code/update/qgcn/" />
      <CodeEditor title="qgat_trainer.py" apiEndpoint="http://127.0.0.1:8000/api/code/update/qgat/" />
      <CodeEditor title="qgcn_trainer_augmented.py" apiEndpoint="http://127.0.0.1:8000/api/code/update/qgcn_augmented/" />
      <CodeEditor title="qgat_trainer_augmented.py" apiEndpoint="http://127.0.0.1:8000/api/code/update/qgat_augmented/" />
    </div>
  );
}

export default DeveloperPage;
