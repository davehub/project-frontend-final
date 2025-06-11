import React, { useState, useEffect } from 'react';
import type { AppUser } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';

const UsersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');

  // Charger les utilisateurs depuis localStorage au démarrage
  useEffect(() => {
    // Note: Les identifiants 'admin' et 'user' sont gérés directement dans AuthContext
    // Ici, nous gérons d'autres utilisateurs qui pourraient être attribués à des équipements.
    const storedUsers = localStorage.getItem('appUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  // Sauvegarder les utilisateurs dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('appUsers', JSON.stringify(users));
  }, [users]);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setFirstName('');
    setLastName('');
    setRole('user');
    setEditingUser(null);
    setShowForm(false);
  };

  const handleAddOrUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrUpdatedUser: AppUser = {
      id: editingUser ? editingUser.id : uuidv4(),
      username,
      email,
      firstName,
      lastName,
      role,
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === newOrUpdatedUser.id ? newOrUpdatedUser : u));
    } else {
      setUsers([...users, newOrUpdatedUser]);
    }
    resetForm();
  };

  const handleEdit = (user: AppUser) => {
    setEditingUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setRole(user.role);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== id));
    }
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">{editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}</h2>
          <form onSubmit={handleAddOrUpdateUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nom d'utilisateur</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Prénom</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Rôle</label>
                <select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'user')} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
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
                {editingUser ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des utilisateurs */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h2>
        {users.length === 0 ? (
          <p className="text-gray-600">Aucun utilisateur enregistré pour le moment (hors "admin" et "user" par défaut).</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nom d'utilisateur
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nom Complet
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.username}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.firstName} {user.lastName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                        user.role === 'admin' ? 'text-purple-900' : 'text-blue-900'
                      }`}>
                        <span aria-hidden="true" className={`absolute inset-0 opacity-50 rounded-full ${
                          user.role === 'admin' ? 'bg-purple-200' : 'bg-blue-200'
                        }`}></span>
                        <span className="relative">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900">
                          <span className="material-icons">edit</span>
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
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

export default UsersPage;