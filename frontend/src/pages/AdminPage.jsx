import { useState } from 'react';
import RunnerButtons from '../components/RunnerButtons';
import VisualizationButtons from '../components/VisualizationButtons';
import TrainingResults from '../components/TrainingResults';
import Visualizations from '../components/Visualizations';
import CodeEditor from '../components/CodeEditor';
import '../styles/AdminPage.css'; // ton css admin

function AdminPage() {
  const [parameters, setParameters] = useState(null);
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
    setParameters(null);
    setImages({});

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/train/?model=${model}`);
      const data = await response.json();
      setAccuracy(data.accuracy);
      setOutput(data.log);
      setParameters(data.parameters);
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
    <div className="admin-container">
      <h1>🎩 Interface Admin</h1>

      <RunnerButtons onTrain={handleTrain} loading={loading} />
      <VisualizationButtons onBefore={fetchVisualBefore} onAfter={fetchVisualAfter} loading={loading} hasTrained={hasTrained} />
      <TrainingResults accuracy={accuracy} parameters={parameters} output={output} />
      <Visualizations images={images} />

      <div className="admin-section">
        <CodeEditor title="✍️ Modifier GCN" apiEndpoint="http://127.0.0.1:8000/api/code/update/gcn/" />
        <CodeEditor title="✍️ Modifier GAT" apiEndpoint="http://127.0.0.1:8000/api/code/update/gat/" />
      </div>
    </div>
  );
}

export default AdminPage;
