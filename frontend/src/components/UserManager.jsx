import { useEffect, useState } from "react";
import axios from "axios";

function UserManager() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/user/user/list/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Fetched users:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs", err);
    }
  };

  const deleteUser = async (id) => {
    if (!id) {
      alert("❌ ID utilisateur invalide !");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/user/user/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchUsers(); // Refresh
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>👥 Liste des utilisateurs</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} — {user.email} — ID: {user.id}
            <button
              onClick={() => deleteUser(user.id)}
              style={{ marginLeft: "1rem", color: "red" }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManager;
