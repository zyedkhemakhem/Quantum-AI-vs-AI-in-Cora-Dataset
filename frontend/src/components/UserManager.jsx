import { useEffect, useState } from "react";
import axios from "axios";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", email: "", password: "" });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/user/user/list/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/user/user/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const updateRole = async (id, role) => {
    const payload = {
      is_admin: role === "admin",
      is_developer: role === "developer",
    };
    try {
      await axios.put(`http://localhost:8000/api/user/user/${id}/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du rôle :", err);
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditForm({ username: user.username, email: user.email, password: "" });
  };

  const handleUpdateUser = async (id) => {
    try {
      const payload = {
        username: editForm.username,
        email: editForm.email,
      };
      if (editForm.password) {
        payload.password = editForm.password;
      }

      await axios.put(`http://localhost:8000/api/user/user/${id}/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <h2>👥 Liste des utilisateurs</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>ID</th>
            <th>Supprimer</th>
            <th>Rôle</th>
            <th>Modifier</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const currentRole = user.is_admin
              ? "admin"
              : user.is_developer
              ? "developer"
              : "user";

            return (
              <tr key={user.id}>
                <td>
                  {editUserId === user.id ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editUserId === user.id ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>{user.id}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)}>Supprimer</button>
                </td>
                <td>
                  <select
                    value={currentRole}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="developer">Développeur</option>
                    <option value="user">Utilisateur</option>
                  </select>
                </td>
                <td>
                  {editUserId === user.id ? (
                    <div>
                      <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      />
                      <button onClick={() => handleUpdateUser(user.id)}>Enregistrer</button>
                      <button onClick={() => setEditUserId(null)}>Annuler</button>
                    </div>
                  ) : (
                    <button onClick={() => handleEditClick(user)}>Modifier</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserManager;
