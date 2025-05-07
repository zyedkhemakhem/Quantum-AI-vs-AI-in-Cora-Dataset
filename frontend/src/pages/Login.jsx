import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/user/login/", {
        username,
        password,
      });

      const { access } = response.data.tokens;
      const { is_admin, is_developer } = response.data.user;
      console.log("Rôles :", { is_admin, is_developer });


      // Sauvegarde du token JWT
      localStorage.setItem("accessToken", access);

      // Redirection en fonction du rôle
      if (is_admin) {
        navigate("/admin");
      } else if (is_developer) {
        navigate("/developer");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError("Identifiants incorrects.");
    }
  };

  return (
    
    
    <div className="login-container" >
      <form onSubmit={handleLogin} className="login-form">
        <h2>Connexion</h2>
        {error && <p className="login-error">{error}</p>}

        <div >
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div >
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" >
          Se connecter
        </button>
      </form>
      <p className="login-footer" > Pas encore inscrit ? <a href="/signup">Créer un compte</a></p>
    </div>
    
  );
};

export default Login;
