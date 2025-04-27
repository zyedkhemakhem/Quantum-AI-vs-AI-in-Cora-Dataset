import { useNavigate } from 'react-router-dom';
import HomeButtons from '../components/HomeButtons';


function Home() {
  const navigate = useNavigate();

  return (
    
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Bienvenue 👋</h1>
      <button onClick={() => navigate('/admin')} style={{ marginRight: '1rem' }}>
        Accéder à l’espace Admin
      </button>
      <button onClick={() => navigate('/user')}>
        Accéder à l’espace Utilisateur
      </button>
    </div>
  );
}

export default Home;
