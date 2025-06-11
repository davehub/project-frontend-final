import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 h-screen shadow-lg">
      <div className="text-2xl font-bold mb-6 text-center">
        Menu
      </div>
      <nav>
        <ul>
          <li className="mb-2">
            <NavLink
              to={isAdmin ? "/admin" : "/user"}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md hover:bg-gray-700 ${isActive ? 'bg-blue-700' : ''}`
              }
            >
              <span className="material-icons mr-3">dashboard</span>
              Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/equipments"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md hover:bg-gray-700 ${isActive ? 'bg-blue-700' : ''}`
              }
            >
              <span className="material-icons mr-3">desktop_windows</span>
              Équipements
            </NavLink>
          </li>
          {isAdmin && (
            <li className="mb-2">
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md hover:bg-gray-700 ${isActive ? 'bg-blue-700' : ''}`
                }
              >
                <span className="material-icons mr-3">group</span>
                Utilisateurs
              </NavLink>
            </li>
          )}
          {/* Ajoutez d'autres liens de navigation ici */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;