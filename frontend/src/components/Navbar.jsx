import '../styles/Layout.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">⚛ Quantum AI VS AI</h2>
      <div className="navbar-actions">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/login" className="nav-link">Connexion</Link>
        <Link to="/signup" className="nav-link">Créer un compte</Link>
      </div>
    </nav>
  );
}

export default Navbar;
