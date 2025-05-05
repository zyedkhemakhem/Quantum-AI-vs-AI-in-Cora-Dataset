import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f0f0",
      width: "100vw",
      height: "100vh",


    }}>
      <form onSubmit={handleLogin} style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "300px",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Connexion</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div style={{ marginBottom: "1rem" }}>
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.7rem",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Se connecter
        </button>
      </form>
      <p
      style={{color:"red" }}
      > Pas encore inscrit ? <a href="/signup">Créer un compte</a></p>

    </div>
  );
};

export default Login;
