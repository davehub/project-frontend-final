import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'material-icons/iconfont/material-icons.css';

interface IUser {
  _id: string;
  username: string;
}

const CreateEquipmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState<'Ordinateur' | 'Imprimante' | 'Serveur' | 'Réseau' | 'Autre'>('Ordinateur');
  const [serialNumber, setSerialNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyEndDate, setWarrantyEndDate] = useState('');
  const [status, setStatus] = useState<'En service' | 'En panne' | 'En maintenance' | 'Hors service'>('En service');
  const [assignedTo, setAssignedTo] = useState<string>(''); // Stocke l'ID de l'utilisateur ou une chaîne vide
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [users, setUsers] = useState<IUser[]>([]); // Liste des utilisateurs pour le select
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_BASE_URL = 'https://project-backend-final-1.onrender.com';

  // Redirection si non authentifié ou non admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login'); // Ou une page d'accès refusé
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Charger la liste des utilisateurs pour le champ "assignedTo"
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            logout();
            throw new Error('Non autorisé ou accès refusé. Veuillez vous reconnecter.');
          }
          throw new Error('Échec de la récupération des utilisateurs.');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: unknown) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        if (err instanceof Error) {
          setError(err.message || 'Impossible de charger la liste des utilisateurs.');
        } else {
          setError('Impossible de charger la liste des utilisateurs.');
        }
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('userToken');
      const equipmentData = {
        name,
        type,
        serialNumber,
        manufacturer: manufacturer || undefined,
        model: model || undefined,
        purchaseDate: purchaseDate ? new Date(purchaseDate).toISOString() : undefined,
        warrantyEndDate: warrantyEndDate ? new Date(warrantyEndDate).toISOString() : undefined,
        status,
        assignedTo: assignedTo || undefined, // Envoyer null si non assigné
        location: location || undefined,
        notes: notes || undefined,
      };

      const response = await fetch(`${API_BASE_URL}/equipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(equipmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la création de l\'équipement.');
      }

      setSuccess('Équipement créé avec succès !');
      // Réinitialiser le formulaire ou rediriger
      setName('');
      setType('Ordinateur');
      setSerialNumber('');
      setManufacturer('');
      setModel('');
      setPurchaseDate('');
      setWarrantyEndDate('');
      setStatus('En service');
      setAssignedTo('');
    } catch (err: unknown) {
      console.error('Erreur de création d\'équipement:', err);
      if (err instanceof Error) {
        setError(err.message || 'Une erreur inattendue est survenue.');
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return <div className="text-center py-8 text-red-600">Accès refusé. Vous devez être un administrateur pour créer un équipement.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ajouter un Nouvel Équipement</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de l'équipement</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" required />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as 'Ordinateur' | 'Imprimante' | 'Serveur' | 'Réseau' | 'Autre')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" required>
              <option value="Ordinateur">Ordinateur</option>
              <option value="Imprimante">Imprimante</option>
              <option value="Serveur">Serveur</option>
              <option value="Réseau">Réseau</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* Numéro de Série */}
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Numéro de Série</label>
            <input type="text" id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" required />
          </div>

          {/* Fabricant */}
          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">Fabricant</label>
            <input type="text" id="manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
          </div>

          {/* Modèle */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modèle</label>
            <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
          </div>

          {/* Date d'achat */}
          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">Date d'achat</label>
            <input type="date" id="purchaseDate" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
          </div>

          {/* Date de fin de garantie */}
          <div>
            <label htmlFor="warrantyEndDate" className="block text-sm font-medium text-gray-700">Fin de Garantie</label>
            <input type="date" id="warrantyEndDate" value={warrantyEndDate} onChange={(e) => setWarrantyEndDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as 'En service' | 'En panne' | 'En maintenance' | 'Hors service')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" required>
              <option value="En service">En service</option>
              <option value="En panne">En panne</option>
              <option value="En maintenance">En maintenance</option>
              <option value="Hors service">Hors service</option>
            </select>
          </div>

          {/* Assigné à */}
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assigner à</label>
            <select id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
              <option value="">Non assigné</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.username}</option>
              ))}
            </select>
          </div>

          {/* Localisation */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Localisation</label>
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/equipments')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mr-4"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-icons animate-spin mr-2">refresh</span> Création...
              </>
            ) : (
              <>
                <span className="material-icons mr-2">save</span> Créer l'équipement
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEquipmentPage;