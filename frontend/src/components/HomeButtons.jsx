import { useNavigate } from 'react-router-dom';

function HomeButtons() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Bienvenue 👋</h1>
      <button onClick={() => navigate('/admin')} style={{ marginRight: '1rem' }}>
        Accéder à l'espace Admin
      </button>
      <button onClick={() => navigate('/user')}>
        Accéder à l'espace Utilisateur
      </button>
    </div>
  );
}

export default HomeButtons;
