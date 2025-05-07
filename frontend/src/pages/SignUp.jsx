import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/SignUp.css';

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
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Inscription</h2>
        {error && <p className="signup-error">{error}</p>}

        <div>
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">S'inscrire</button>
        <p className="signup-footer">
        Déjà inscrit ? <a href="/login">Connectez-vous</a>
        </p>

      </form>
    </div>
  );
};

export default SignUp;
