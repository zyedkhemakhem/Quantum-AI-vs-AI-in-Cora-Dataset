import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:8000/api/user/register/", {
        ...formData,
        is_admin: false,       // Forcé à false
        is_developer: false    // Forcé à false 
      });

      navigate("/user"); // Redirection vers la page de user après succès
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'inscription. Vérifiez les champs.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      background: "#f0f0f0",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "300px",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color:"blue" }}>Inscription</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{color:"green"}} >Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{color:"green"}} >Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{color:"green"}} >Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.7rem",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default SignUp;
