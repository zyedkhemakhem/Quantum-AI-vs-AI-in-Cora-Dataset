import LogoutButton from "../components/LogoutButton";
import UserManager from "../components/UserManager";

function AdminPage() {
  return (
    <div className="admin-container">
      <LogoutButton />
      <h1>🎛️ Tableau de bord Admin</h1>
      <UserManager />
    </div>
  );
}

export default AdminPage;
