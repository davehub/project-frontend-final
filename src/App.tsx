import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage'; // Import de la nouvelle HomePage

import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EquipmentsManagementPage from './pages/EquipmentsManagementPage';
import UsersManagementPage from './pages/UsersManagementPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
// import Footer from './components/common/Footer'; // Décommentez si vous en avez un

function App() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <div className="flex min-h-screen">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1"> {/* Supprimez le padding ici pour que HomePage occupe tout l'espace si elle est affichée */}
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/user"} /> : <HomePage />}
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Si non authentifié, va sur la HomePage. Sinon, va vers le tableau de bord approprié. */}
            

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipments"
              element={
                <ProtectedRoute>
                  <EquipmentsManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <UsersManagementPage />
                </ProtectedRoute>
              }
            />
            {/* Si une route n'est pas trouvée, redirige vers la racine, qui gérera l'authentification */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default App;