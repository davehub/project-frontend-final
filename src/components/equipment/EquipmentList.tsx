import React from 'react';
import type { Equipment } from '../../types';


interface EquipmentListProps {
  equipments: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean; // Pour gérer les permissions d'affichage des actions
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipments, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Liste des Équipements</h2>
      {equipments.length === 0 ? (
        <p className="text-gray-600">Aucun équipement enregistré pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Numéro de Série
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Attribué à
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Localisation
                </th>
                {isAdmin && (
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {equipments.map((equipment) => (
                <tr key={equipment.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{equipment.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{equipment.type}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{equipment.serialNumber}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      equipment.status === 'En service' ? 'text-green-900' :
                      equipment.status === 'En panne' ? 'text-red-900' :
                      'text-yellow-900'
                    }`}>
                      <span aria-hidden="true" className={`absolute inset-0 opacity-50 rounded-full ${
                        equipment.status === 'En service' ? 'bg-green-200' :
                        equipment.status === 'En panne' ? 'bg-red-200' :
                        'bg-yellow-200'
                      }`}></span>
                      <span className="relative">{equipment.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{equipment.assignedTo || 'Non attribué'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{equipment.location}</p>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => onEdit(equipment)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100">
                          <span className="material-icons">edit</span>
                        </button>
                        <button onClick={() => onDelete(equipment.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;