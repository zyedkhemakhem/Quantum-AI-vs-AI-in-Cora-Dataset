import { useState } from "react";
import axios from "axios";


function AdminCreateUser() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", 
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { username, email, password, role } = formData;

    const payload = {
      username,
      email,
      password,
      is_admin: role === "admin",
      is_developer: role === "developer",
    };

    try {
      await axios.post("http://localhost:8000/api/user/register/", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setMessage("✅ Utilisateur ajouté avec succès !");
      setFormData({ username: "", email: "", password: "", role: "user" });
    } catch (err) {
      setMessage("❌ Erreur lors de l'ajout.");
      console.error(err);
    }
  };

  return (

   
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>➕ Ajouter un utilisateur</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Rôle :</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: "100%" }}
          >
            <option value="user">Utilisateur</option>
            <option value="developer">Développeur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Créer le compte
        </button>
      </form>
    </div>
  );
}

export default AdminCreateUser;