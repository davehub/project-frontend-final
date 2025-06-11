import React, { useState, useEffect } from 'react';
import type { Equipment } from '../types';
import { v4 as uuidv4 } from 'uuid'; // Pour générer des IDs uniques

import { useAuth } from '../context/AuthContext';

// Installer uuid: npm install uuid @types/uuid

const EquipmentsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<Equipment['type']>('Ordinateur');
  const [serialNumber, setSerialNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyEndDate, setWarrantyEndDate] = useState('');
  const [status, setStatus] = useState<Equipment['status']>('En service');
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Charger les équipements depuis localStorage au démarrage
  useEffect(() => {
    const storedEquipments = localStorage.getItem('equipments');
    if (storedEquipments) {
      setEquipments(JSON.parse(storedEquipments));
    }
  }, []);

  // Sauvegarder les équipements dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('equipments', JSON.stringify(equipments));
  }, [equipments]);

  const resetForm = () => {
    setName('');
    setType('Ordinateur');
    setSerialNumber('');
    setManufacturer('');
    setModel('');
    setPurchaseDate('');
    setWarrantyEndDate('');
    setStatus('En service');
    setAssignedTo(null);
    setLocation('');
    setNotes('');
    setEditingEquipment(null);
    setShowForm(false);
  };

  const handleAddOrUpdateEquipment = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrUpdatedEquipment: Equipment = {
      id: editingEquipment ? editingEquipment.id : uuidv4(),
      name,
      type,
      serialNumber,
      manufacturer,
      model,
      purchaseDate,
      warrantyEndDate,
      status,
      assignedTo: assignedTo === '' ? null : assignedTo,
      location,
      notes,
    };

    if (editingEquipment) {
      setEquipments(equipments.map(eq => eq.id === newOrUpdatedEquipment.id ? newOrUpdatedEquipment : eq));
    } else {
      setEquipments([...equipments, newOrUpdatedEquipment]);
    }
    resetForm();
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setName(equipment.name);
    setType(equipment.type);
    setSerialNumber(equipment.serialNumber);
    setManufacturer(equipment.manufacturer);
    setModel(equipment.model);
    setPurchaseDate(equipment.purchaseDate);
    setWarrantyEndDate(equipment.warrantyEndDate);
    setStatus(equipment.status);
    setAssignedTo(equipment.assignedTo);
    setLocation(equipment.location);
    setNotes(equipment.notes || '');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      setEquipments(equipments.filter(eq => eq.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Équipements</h1>

      {isAdmin && (
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 flex items-center"
        >
          <span className="material-icons mr-2">add</span>Ajouter un Équipement
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">{editingEquipment ? 'Modifier l\'équipement' : 'Ajouter un nouvel équipement'}</h2>
          <form onSubmit={handleAddOrUpdateEquipment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as Equipment['type'])} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                  <option value="Ordinateur">Ordinateur</option>
                  <option value="Imprimante">Imprimante</option>
                  <option value="Serveur">Serveur</option>
                  <option value="Réseau">Réseau</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Numéro de Série</label>
                <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Fabricant</label>
                <input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Modèle</label>
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date d'Achat</label>
                <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Fin de Garantie</label>
                <input type="date" value={warrantyEndDate} onChange={(e) => setWarrantyEndDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Statut</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as Equipment['status'])} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                  <option value="En service">En service</option>
                  <option value="En panne">En panne</option>
                  <option value="En maintenance">En maintenance</option>
                  <option value="Hors service">Hors service</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Attribué à (nom d'utilisateur)</label>
                <input type="text" value={assignedTo || ''} onChange={(e) => setAssignedTo(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Laisser vide si non attribué" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Localisation</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {editingEquipment ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des équipements */}
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
                          <button onClick={() => handleEdit(equipment)} className="text-indigo-600 hover:text-indigo-900">
                            <span className="material-icons">edit</span>
                          </button>
                          <button onClick={() => handleDelete(equipment.id)} className="text-red-600 hover:text-red-900">
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
    </div>
  );
};

export default EquipmentsPage;