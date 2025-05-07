import LogoutButton from "../components/LogoutButton";
import UserManager from "../components/UserManager";
import AdminCreateUser from "../components/AdminCreateUser"; // ✅ ajouter ceci

function AdminPage() {
  return (
    <div className="admin-container">
      <LogoutButton />
      <h1>🎛️ Tableau de bord Admin</h1>
      <AdminCreateUser /> {/* ✅ Ajouter ici le formulaire de création */}
      <hr style={{ margin: "2rem 0" }} />
      <UserManager />
    </div>
  );
}

export default AdminPage;
