import React from 'react';
import { NavLink } from 'react-router-dom';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
      <div className="text-center bg-white text-black bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-10 max-w-2xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 animate-fadeIn">
          Bienvenue dans votre Gestionnaire de Parc Informatique
        </h1>
        <p className="text-xl mb-8 animate-slideUp text-black">
          Optimisez la gestion de vos équipements et utilisateurs en toute simplicité.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <NavLink
            to="/login"
            className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-800 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <span className="material-icons mr-2">login</span> Se connecter
          </NavLink>
          <NavLink
            to="/register"
            className="bg-blue-700 text-white hover:bg-blue-800 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center border-2 border-white"
          >
            <span className="material-icons mr-2">person_add</span> S'inscrire
          </NavLink>
        </div>

        <p className="text-lg mt-12 text-black">
          Gérez vos actifs informatiques, suivez leur état, et assurez un contrôle efficace.
        </p>
      </div>
    </div>
  );
};

export default HomePage;