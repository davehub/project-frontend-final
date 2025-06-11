import React from 'react';
import type { Equipment } from '../../types';


interface EquipmentDetailsProps {
  equipment: Equipment;
  onClose?: () => void; // Optionnel, si utilisé dans une modale ou similaire
}

const EquipmentDetails: React.FC<EquipmentDetailsProps> = ({ equipment, onClose }) => {
  if (!equipment) {
    return <div className="text-gray-600">Aucun équipement sélectionné.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Détails de l'Équipement</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            title="Fermer"
          >
            <span className="material-icons">close</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <p className="font-semibold mb-1">Nom:</p>
          <p className="mb-3">{equipment.name}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Type:</p>
          <p className="mb-3">{equipment.type}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Numéro de Série:</p>
          <p className="mb-3">{equipment.serialNumber}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Fabricant:</p>
          <p className="mb-3">{equipment.manufacturer || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Modèle:</p>
          <p className="mb-3">{equipment.model || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Date d'Achat:</p>
          <p className="mb-3">{equipment.purchaseDate || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Fin de Garantie:</p>
          <p className="mb-3">{equipment.warrantyEndDate || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Statut:</p>
          <p className={`font-semibold ${
            equipment.status === 'En service' ? 'text-green-600' :
            equipment.status === 'En panne' ? 'text-red-600' :
            'text-yellow-600'
          }`}>{equipment.status}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Attribué à:</p>
          <p className="mb-3">{equipment.assignedTo || 'Non attribué'}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Localisation:</p>
          <p className="mb-3">{equipment.location}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-semibold mb-1">Notes:</p>
        <p className="bg-gray-50 p-3 rounded-md text-gray-800">{equipment.notes || 'Aucune note.'}</p>
      </div>
    </div>
  );
};

export default EquipmentDetails;