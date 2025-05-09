import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import DeveloperPage from './pages/DeveloperPage';
import UserPage from './pages/UserPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Layout from './components/Layout';
import "./App.css";
import Home from './pages/Home';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
          <Home />
          </Layout>
          } />
        <Route path="/signup" element={
          <Layout>
          <SignUp />
          </Layout>
          } />

        <Route path="/login" element={
          <Layout>
          <Login />
          </Layout>
          } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout>
              <AdminPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/developer" element={
          <ProtectedRoute>
            <Layout>
              <DeveloperPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/user" element={
          <ProtectedRoute>
            <Layout>
              <UserPage />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>

      

    </Router>
  );
}

export default App;