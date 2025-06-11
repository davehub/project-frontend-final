import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 shadow-md flex justify-between items-center text-white">
      <Link to="/" className="text-xl font-bold">
        <span className="material-icons mr-2">computer</span>Gestion de Parc
      </Link>
      <div className="flex items-center">
        {user && (
          <span className="mr-4">Bienvenue, {user.username} ({user.role})</span>
        )}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <span className="material-icons mr-2">logout</span>Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;