import UserManager from "../components/UserManager";
import '../styles/AdminPage.css'; // optionnel si tu as du style
import LogoutButton from "../components/LogoutButton";

function AdminPage() {
  return (
    <div className="admin-container">
      <LogoutButton />
      <h1>🎩 Interface Admin — Gestion des Utilisateurs</h1>
      <UserManager />
    </div>
  );
}

export default AdminPage;
