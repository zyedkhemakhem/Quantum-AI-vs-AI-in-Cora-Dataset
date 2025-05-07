import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Bienvenue dans <span className="highlight">Quantum AI VS AI</span></h1>
        <p className="home-description">
          Découvrez la puissance des réseaux de neurones quantiques pour détecter les communautés dans les réseaux sociaux complexes.
        </p>
        <div className="home-buttons">
          <button onClick={() => navigate('/signup')} className="home-btn">S'inscrire</button>
          <button onClick={() => navigate('/login')} className="home-btn">Se connecter</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
