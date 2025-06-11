import React, { useState, useEffect } from 'react';
import type { Equipment } from '../types';
import { v4 as uuidv4 } from 'uuid';
import EquipmentForm from '../components/equipment/EquipmentForm';
import EquipmentList from '../components/equipment/EquipmentList';
import { useAuth } from '../context/AuthContext';


const EquipmentsManagementPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

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

  const handleAddOrUpdateEquipment = (equipment: Equipment) => {
    if (editingEquipment) {
      setEquipments(prevEquipments => prevEquipments.map(eq => eq.id === equipment.id ? equipment : eq));
    } else {
      setEquipments(prevEquipments => [...prevEquipments, { ...equipment, id: uuidv4() }]);
    }
    resetForm();
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setShowForm(true);
  };

  const handleDeleteEquipment = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      setEquipments(prevEquipments => prevEquipments.filter(eq => eq.id !== id));
    }
  };

  const resetForm = () => {
    setEditingEquipment(null);
    setShowForm(false);
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
        <EquipmentForm
          equipment={editingEquipment}
          onSubmit={handleAddOrUpdateEquipment}
          onCancel={resetForm}
        />
      )}

      <EquipmentList
        equipments={equipments}
        onEdit={handleEditEquipment}
        onDelete={handleDeleteEquipment}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default EquipmentsManagementPage;