import React, { useState, useEffect } from 'react';
import type { AppUser } from '../types';
import { v4 as uuidv4 } from 'uuid';
import UserForm from '../components/user/UserForm';
import UserList from '../components/user/UserList';
import { useAuth } from '../context/AuthContext';


const UsersManagementPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  // Charger les utilisateurs depuis localStorage au démarrage
  useEffect(() => {
    const storedUsers = localStorage.getItem('appUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  // Sauvegarder les utilisateurs dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('appUsers', JSON.stringify(users));
  }, [users]);

  const handleAddOrUpdateUser = (user: AppUser) => {
    if (editingUser) {
      setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? user : u));
    } else {
      setUsers(prevUsers => [...prevUsers, { ...user, id: uuidv4() }]);
    }
    resetForm();
  };

  const handleEditUser = (user: AppUser) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  if (!isAdmin) {
    return (
      <div className="p-6 text-red-600">
        <h1 className="text-3xl font-bold mb-6">Accès Refusé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>

      <button
        onClick={() => { resetForm(); setShowForm(true); }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 flex items-center"
      >
        <span className="material-icons mr-2">person_add</span>Ajouter un Utilisateur
      </button>

      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleAddOrUpdateUser}
          onCancel={resetForm}
        />
      )}

      <UserList
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default UsersManagementPage;