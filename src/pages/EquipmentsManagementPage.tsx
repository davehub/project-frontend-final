import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom'; // Pour l'ajout d'équipement

// Définir les interfaces pour les équipements et les utilisateurs
interface IUser {
  _id: string;
  username: string;
  email: string;
}

interface IEquipment {
  _id: string;
  name: string;
  type: 'Ordinateur' | 'Imprimante' | 'Serveur' | 'Réseau' | 'Autre';
  serialNumber: string;
  manufacturer?: string;
  model?: string;
  purchaseDate?: string; // Peut être une date ISO string
  warrantyEndDate?: string;
  status: 'En service' | 'En panne' | 'En maintenance' | 'Hors service';
  assignedTo?: IUser; // L'utilisateur assigné sera populé
  createdBy?: IUser;  // L'utilisateur qui a créé sera populé
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const EquipmentsManagementPage: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth(); // Récupérer l'utilisateur connecté
  const [equipments, setEquipments] = useState<IEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignedTo, setFilterAssignedTo] = useState('all');
  const [users, setUsers] = useState<IUser[]>([]); // Pour la liste des utilisateurs assignables
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const API_BASE_URL = 'https://project-backend-final-2.onrender.com/api'; // Remplacez par l'URL de votre API

  // Fonction pour récupérer la liste des utilisateurs (pour le filtre assignedTo)
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return; // Seuls les admins peuvent voir tous les utilisateurs

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Non autorisé ou accès refusé. Veuillez vous reconnecter.');
        }
        throw new Error('Échec de la récupération des utilisateurs.');
      }
      const data = await response.json();
      setUsers(data); // Assuming the backend returns an array of user objects
    } catch (err: unknown) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      if (err instanceof Error) {
        setError(err.message || 'Impossible de charger la liste des utilisateurs.');
        if (err.message.includes('reconnecter')) {
          logout(); // Déconnecte si le token est invalide
        }
      } else {
        setError('Impossible de charger la liste des utilisateurs.');
      }
    }
  }, [isAuthenticated, isAdmin, logout]);

  // Fonction pour récupérer les équipements avec filtres et pagination
  const fetchEquipments = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('userToken');
      // Construire l'URL avec les paramètres de requête
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterType !== 'all') queryParams.append('type', filterType);
      if (filterStatus !== 'all') queryParams.append('status', filterStatus);
      if (filterAssignedTo !== 'all') queryParams.append('assignedTo', filterAssignedTo);
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', '10'); // Limite fixe pour l'exemple

      const response = await fetch(`${API_BASE_URL}/equipments?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Non autorisé ou accès refusé. Veuillez vous reconnecter.');
        }
        throw new Error('Échec de la récupération des équipements.');
      }

      const data = await response.json();
      setEquipments(data.equipments);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);

    } catch (err: unknown) {
      console.error('Erreur lors de la récupération des équipements:', err);
      if (err instanceof Error) {
        setError(err.message || 'Impossible de charger les équipements.');
        if (err.message.includes('reconnecter')) {
          logout();
        }
      } else {
        setError('Impossible de charger les équipements.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchTerm, filterType, filterStatus, filterAssignedTo, currentPage, logout]);

  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  // Récupère la liste des utilisateurs si admin
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Réinitialise la page lors de la recherche
  };

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterAssignedToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterAssignedTo(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des équipements...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des Équipements</h1>

      {/* Section de recherche et filtrage */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Champ de recherche */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Recherche</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                <span className="material-icons text-lg">search</span>
              </span>
              <input
                type="text"
                id="search"
                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                placeholder="Nom, numéro de série, fabricant..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Filtre par Type */}
          <div>
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="filterType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterType}
              onChange={handleFilterTypeChange}
            >
              <option value="all">Tous les types</option>
              <option value="Ordinateur">Ordinateur</option>
              <option value="Imprimante">Imprimante</option>
              <option value="Serveur">Serveur</option>
              <option value="Réseau">Réseau</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* Filtre par Statut */}
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              id="filterStatus"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={handleFilterStatusChange}
            >
              <option value="all">Tous les statuts</option>
              <option value="En service">En service</option>
              <option value="En panne">En panne</option>
              <option value="En maintenance">En maintenance</option>
              <option value="Hors service">Hors service</option>
            </select>
          </div>

          {/* Filtre par Utilisateur Assigné (visible seulement pour les admins) */}
          {isAdmin && (
            <div>
              <label htmlFor="filterAssignedTo" className="block text-sm font-medium text-gray-700">Assigné à</label>
              <select
                id="filterAssignedTo"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterAssignedTo}
                onChange={handleFilterAssignedToChange}
              >
                <option value="all">Tous les utilisateurs</option>
                {users.map(u => (
                  <option key={u._id} value={u.username}>{u.username}</option>
                ))}
                {/* Option pour les équipements non assignés */}
                <option value="unassigned">Non assigné</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="mb-6 text-right">
          <NavLink to="/equipments/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <span className="material-icons mr-2">add_circle</span> Ajouter un équipement
          </NavLink>
        </div>
      )}

      {totalCount === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">Aucun équipement trouvé avec ces critères.</p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro de Série</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigné à</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipments.map((equipment) => (
                  <tr key={equipment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{equipment.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${equipment.status === 'En service' ? 'bg-green-100 text-green-800' : ''}
                        ${equipment.status === 'En panne' ? 'bg-red-100 text-red-800' : ''}
                        ${equipment.status === 'En maintenance' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${equipment.status === 'Hors service' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {equipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {equipment.assignedTo ? equipment.assignedTo.username : 'Non assigné'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <NavLink to={`/equipments/${equipment._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
  <span className="material-icons text-base">info</span>
</NavLink>
                      {isAdmin && (
                        <>
                          <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                            <span className="material-icons text-base">edit</span>
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <span className="material-icons text-base">delete</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="material-icons">chevron_left</span>
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                      ${currentPage === index + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="material-icons">chevron_right</span>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EquipmentsManagementPage;