import React, { useState, useEffect } from 'react';
import type { Equipment } from '../../types';


interface EquipmentFormProps {
  equipment?: Equipment | null; // Équipement à modifier, ou null pour l'ajout
  onSubmit: (equipment: Equipment) => void;
  onCancel: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onSubmit, onCancel }) => {
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

  useEffect(() => {
    if (equipment) {
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
    } else {
      // Réinitialiser le formulaire pour un nouvel ajout
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
    }
  }, [equipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEquipment: Equipment = {
      id: equipment?.id || '', // L'ID sera généré par le parent si c'est un nouvel équipement
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
    onSubmit(newEquipment);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4">{equipment ? 'Modifier l\'équipement' : 'Ajouter un nouvel équipement'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Equipment['type'])}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="Ordinateur">Ordinateur</option>
              <option value="Imprimante">Imprimante</option>
              <option value="Serveur">Serveur</option>
              <option value="Réseau">Réseau</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Numéro de Série</label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Fabricant</label>
            <input
              type="text"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Modèle</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Date d'Achat</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Fin de Garantie</label>
            <input
              type="date"
              value={warrantyEndDate}
              onChange={(e) => setWarrantyEndDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Equipment['status'])}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="En service">En service</option>
              <option value="En panne">En panne</option>
              <option value="En maintenance">En maintenance</option>
              <option value="Hors service">Hors service</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Attribué à (nom d'utilisateur)</label>
            <input
              type="text"
              value={assignedTo || ''}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Laisser vide si non attribué"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Localisation</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2 flex items-center"
          >
            <span className="material-icons mr-1 text-sm">cancel</span> Annuler
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <span className="material-icons mr-1 text-sm">{equipment ? 'update' : 'add'}</span> {equipment ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;