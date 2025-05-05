import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import DeveloperPage from './pages/DeveloperPage';
import UserPage from './pages/UserPage';
import Login from './components/Login';
import SignUp from './components/SignUp';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />

        <Route path="/developer" element={
          <ProtectedRoute>
            <DeveloperPage />
          </ProtectedRoute>
        } />

        <Route path="/user" element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
