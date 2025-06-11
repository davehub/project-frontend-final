import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Equipment } from '../types';


const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [assignedEquipments, setAssignedEquipments] = useState<Equipment[]>([]);

  useEffect(() => {
    // Dans une vraie application, vous feriez un appel API.
    // Ici, on simule la récupération des équipements depuis localStorage.
    const allEquipments: Equipment[] = JSON.parse(localStorage.getItem('equipments') || '[]');
    if (user) {
      const userEquipments = allEquipments.filter(eq => eq.assignedTo === user.username);
      setAssignedEquipments(userEquipments);
    }
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mon Tableau de Bord</h1>

      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
        <p className="font-bold">Bienvenue, {user?.username} !</p>
        <p>Voici un aperçu de vos équipements attribués.</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Mes Équipements Attribués</h2>
      {assignedEquipments.length === 0 ? (
        <p className="text-gray-600">Aucun équipement ne vous est actuellement attribué.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedEquipments.map((equipment) => (
            <div key={equipment.id} className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <span className="material-icons text-blue-500 text-4xl mr-4">desktop_windows</span>
              <div>
                <h3 className="text-lg font-semibold">{equipment.name}</h3>
                <p className="text-gray-600">Type: {equipment.type}</p>
                <p className="text-gray-600">Statut: <span className={`font-medium ${equipment.status === 'En service' ? 'text-green-600' : 'text-red-600'}`}>{equipment.status}</span></p>
                <p className="text-gray-600">Localisation: {equipment.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section pour les demandes de support ou informations utiles */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Support et Ressources</h2>
        <p className="text-gray-600 mb-4">
          Si vous rencontrez un problème avec votre équipement, veuillez contacter le service informatique.
        </p>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <span className="material-icons mr-2">contact_support</span>Contacter le Support
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;