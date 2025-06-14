import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


interface IUser {
  _id: string;
  username: string;
  email: string;
}
export interface AuthUser {
  _id: string;
  username: string;
  email?: string;
  role: 'user' | 'admin';
}

interface IEquipment {
  _id: string;
  name: string;
  type: string;
  serialNumber: string;
  manufacturer?: string;
  model?: string;
  purchaseDate?: string;
  warrantyEndDate?: string;
  status: string;
  assignedTo?: IUser;
  createdBy?: IUser;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface IMaintenanceRecord {
  _id: string;
  equipment: string; // Juste l'ID ici
  maintenanceDate: string;
  description: string;
  performedBy: IUser;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Récupère l'ID de l'URL
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [equipment, setEquipment] = useState<IEquipment | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<IMaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pour le formulaire d'ajout de maintenance
  const [newMaintenanceDescription, setNewMaintenanceDescription] = useState('');
  const [newMaintenanceDate, setNewMaintenanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMaintenanceCost, setNewMaintenanceCost] = useState<number | ''>('');
  const [newMaintenanceNotes, setNewMaintenanceNotes] = useState('');
  const [addingMaintenance, setAddingMaintenance] = useState(false);

  const API_BASE_URL = 'https://project-backend-final-2.onrender.com/api'; // Remplacez par l'URL de votre API

  const fetchEquipmentAndMaintenance = useCallback(async () => {
    if (!isAuthenticated || !id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('userToken');

      // Récupérer l'équipement
      const equipmentResponse = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!equipmentResponse.ok) {
        if (equipmentResponse.status === 401 || equipmentResponse.status === 403) {
          logout();
          throw new Error('Accès refusé à cet équipement. Veuillez vous reconnecter.');
        }
        throw new Error('Équipement non trouvé ou erreur de chargement.');
      }
      const eqData = await equipmentResponse.json();
      setEquipment(eqData);

      // Récupérer les enregistrements de maintenance
      const maintenanceResponse = await fetch(`${API_BASE_URL}/maintenances/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!maintenanceResponse.ok) {
        if (maintenanceResponse.status === 401 || maintenanceResponse.status === 403) {
          throw new Error('Accès refusé à l\'historique de maintenance. Veuillez vous reconnecter.');
        }
        throw new Error('Échec du chargement de l\'historique de maintenance.');
      }
      const maintData = await maintenanceResponse.json();
      setMaintenanceRecords(maintData);

    } catch (err: unknown) {
      console.error('Erreur lors du chargement des détails de l\'équipement ou de la maintenance:', err);
      if (err instanceof Error) {
        setError(err.message || 'Erreur inattendue lors du chargement.');
      } else {
        setError('Erreur inattendue lors du chargement.');
      }
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, logout]);

  useEffect(() => {
    fetchEquipmentAndMaintenance();
  }, [fetchEquipmentAndMaintenance]);

  const handleAddMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingMaintenance(true);
    setError(null);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/maintenances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipmentId: id,
          maintenanceDate: newMaintenanceDate,
          description: newMaintenanceDescription,
          cost: newMaintenanceCost === '' ? undefined : newMaintenanceCost,
          notes: newMaintenanceNotes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de l\'ajout de l\'enregistrement de maintenance.');
      }

      // Recharger les données après un ajout réussi
      await fetchEquipmentAndMaintenance();
      // Réinitialiser le formulaire
      setNewMaintenanceDescription('');
      setNewMaintenanceDate(new Date().toISOString().split('T')[0]);
      setNewMaintenanceCost('');
      setNewMaintenanceNotes('');

    } catch (err: unknown) {
      console.error('Erreur lors de l\'ajout de maintenance:', err);
      if (err instanceof Error) {
        setError(err.message || 'Erreur inattendue lors de l\'ajout.');
      } else {
        setError('Erreur inattendue lors de l\'ajout.');
      }
    } finally {
      setAddingMaintenance(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des détails de l'équipement...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  }

  if (!equipment) {
    return <div className="text-center py-8 text-gray-600">Équipement non trouvé.</div>;
  }

  // Vérifier l'accès pour les utilisateurs non admin
  const isAssignedToCurrentUser = equipment.assignedTo?._id === (user as AuthUser | undefined)?._id;
  if (!isAdmin && !isAssignedToCurrentUser) {
    return <div className="text-center py-8 text-red-600">Vous n'avez pas l'autorisation de voir les détails de cet équipement.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Détails de l'équipement : {equipment.name}</h1>

      {/* Informations sur l'équipement */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Informations Générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Nom:</strong> {equipment.name}</p>
          <p><strong>Type:</strong> {equipment.type}</p>
          <p><strong>Numéro de Série:</strong> {equipment.serialNumber}</p>
          <p><strong>Fabricant:</strong> {equipment.manufacturer || 'N/A'}</p>
          <p><strong>Modèle:</strong> {equipment.model || 'N/A'}</p>
          <p><strong>Date d'achat:</strong> {equipment.purchaseDate ? new Date(equipment.purchaseDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Fin de Garantie:</strong> {equipment.warrantyEndDate ? new Date(equipment.warrantyEndDate).toLocaleDateString() : 'N/A'}</p>
          <p>
            <strong>Statut:</strong>
            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full
              ${equipment.status === 'En service' ? 'bg-green-100 text-green-800' : ''}
              ${equipment.status === 'En panne' ? 'bg-red-100 text-red-800' : ''}
              ${equipment.status === 'En maintenance' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${equipment.status === 'Hors service' ? 'bg-gray-100 text-gray-800' : ''}
            `}>
              {equipment.status}
            </span>
          </p>
          <p><strong>Assigné à:</strong> {equipment.assignedTo ? equipment.assignedTo.username : 'Non assigné'}</p>
          <p><strong>Localisation:</strong> {equipment.location || 'N/A'}</p>
          <p><strong>Créé par:</strong> {equipment.createdBy ? equipment.createdBy.username : 'Inconnu'}</p>
          <div className="md:col-span-2">
            <p><strong>Notes:</strong> {equipment.notes || 'Aucune'}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="mt-6 text-right">
            <button
              onClick={() => navigate(`/equipments/edit/${equipment._id}`)} // Vous devrez créer cette page
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="material-icons mr-2">edit</span> Modifier l'équipement
            </button>
          </div>
        )}
      </div>

      {/* Historique des Maintenances */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Historique des Maintenances/Interventions</h2>
        {maintenanceRecords.length === 0 ? (
          <p className="text-gray-600">Aucun enregistrement de maintenance pour cet équipement.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectué par</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maintenanceRecords.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.maintenanceDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{record.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.performedBy ? record.performedBy.username : 'Inconnu'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.cost !== undefined ? `${record.cost} €` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{record.notes || 'Aucune'}</td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Ajoutez ici les boutons d'édition/suppression pour l'enregistrement de maintenance */}
                        {/* <button className="text-indigo-600 hover:text-indigo-900 mr-4">Modifier</button> */}
                        {/* <button className="text-red-600 hover:text-red-900">Supprimer</button> */}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulaire d'ajout de maintenance */}
        {(isAdmin || isAssignedToCurrentUser) && ( // Un admin ou l'utilisateur assigné peut ajouter une maintenance
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Ajouter un enregistrement de maintenance</h3>
            <form onSubmit={handleAddMaintenance} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="maintenanceDate" className="block text-sm font-medium text-gray-700">Date de l'intervention</label>
                <input type="date" id="maintenanceDate" value={newMaintenanceDate} onChange={(e) => setNewMaintenanceDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="newMaintenanceDescription" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="newMaintenanceDescription" rows={3} value={newMaintenanceDescription} onChange={(e) => setNewMaintenanceDescription(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" required></textarea>
              </div>
              <div>
                <label htmlFor="newMaintenanceCost" className="block text-sm font-medium text-gray-700">Coût (€)</label>
                <input type="number" id="newMaintenanceCost" value={newMaintenanceCost} onChange={(e) => setNewMaintenanceCost(parseFloat(e.target.value) || '')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
              </div>
              <div>
                <label htmlFor="newMaintenanceNotes" className="block text-sm font-medium text-gray-700">Notes</label>
                <input type="text" id="newMaintenanceNotes" value={newMaintenanceNotes} onChange={(e) => setNewMaintenanceNotes(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
              </div>
              <div className="md:col-span-2 text-right">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline flex items-center justify-center float-right"
                  disabled={addingMaintenance}
                >
                  {addingMaintenance ? (
                    <>
                      <span className="material-icons animate-spin mr-2">refresh</span> Ajout...
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-2">add_circle</span> Ajouter l'enregistrement
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate('/equipments')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
        >
          Retour à la liste des équipements
        </button>
      </div>
    </div>
  );
};

export default EquipmentDetailPage;