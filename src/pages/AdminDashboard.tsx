import React from 'react';
import { Link } from 'react-router-dom';


const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte : Aperçu des équipements */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Total Équipements</h3>
            <p className="text-4xl font-bold text-blue-600">150</p> {/* Donnée fictive */}
          </div>
          <span className="material-icons text-blue-400 text-6xl">desktop_windows</span>
        </div>

        {/* Carte : Équipements en panne */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Équipements en Panne</h3>
            <p className="text-4xl font-bold text-red-600">5</p> {/* Donnée fictive */}
          </div>
          <span className="material-icons text-red-400 text-6xl">error</span>
        </div>

        {/* Carte : Utilisateurs enregistrés */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Utilisateurs</h3>
            <p className="text-4xl font-bold text-green-600">30</p> {/* Donnée fictive */}
          </div>
          <span className="material-icons text-green-400 text-6xl">group</span>
        </div>

        {/* Liens rapides */}
        <div className="col-span-full mt-8">
          <h2 className="text-2xl font-bold mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/equipments" className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
              <span className="material-icons text-4xl mb-2">add_circle</span>
              Ajouter un Équipement
            </Link>
            <Link to="/users" className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
              <span className="material-icons text-4xl mb-2">person_add</span>
              Gérer les Utilisateurs
            </Link>
            <Link to="/equipments" className="bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
              <span className="material-icons text-4xl mb-2">list_alt</span>
              Voir tous les Équipements
            </Link>
          </div>
        </div>

        {/* Section pour les rapports ou graphiques (à développer) */}
        <div className="col-span-full mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Rapports et Statistiques</h2>
          <p className="text-gray-600">Cette section affichera des graphiques et des rapports sur l'état du parc.</p>
          {/* Ici, vous pourriez intégrer des bibliothèques de graphiques comme Chart.js ou Recharts */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;