import CodeEditor from '../components/CodeEditor';
import RunnerButtons from '../components/RunnerButtons';
import LogoutButton from "../components/LogoutButton";
function DeveloperPage() {
  return (
    <div className="developer-container">
      <LogoutButton />
      <h1>💻 Interface Développeur</h1>
      <RunnerButtons onTrain={(model) => {/* optionnel selon logique */}} loading={false} />
      <CodeEditor title="Modifier GCN" apiEndpoint="http://127.0.0.1:8000/api/code/update/gcn/" />
      <CodeEditor title="Modifier GAT" apiEndpoint="http://127.0.0.1:8000/api/code/update/gat/" />
    </div>
  );
}

export default DeveloperPage;
