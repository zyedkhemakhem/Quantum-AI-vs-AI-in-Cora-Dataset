import UserManager from "../components/UserManager";
import AdminCreateUser from "../components/AdminCreateUser";
import LogoutButton from "../components/LogoutButton";
import "../styles/AdminPage.css";


function AdminPage() {
  return (
    <>
      

      <div className="admin-container">
        
        <h1>🎛️ Tableau de bord Admin</h1>

        <div className="card-section">
          <AdminCreateUser />
        </div>

        <div className="card-section">
          <UserManager />
        </div>

        <LogoutButton className="logout-button" />
      </div>

      
    </>
  );
}

export default AdminPage;