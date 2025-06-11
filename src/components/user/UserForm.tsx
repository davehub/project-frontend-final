import React, { useState, useEffect } from 'react';
import type { AppUser } from '../../types';


interface UserFormProps {
  user?: AppUser | null; // Utilisateur à modifier, ou null pour l'ajout
  onSubmit: (user: AppUser) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setRole(user.role);
    } else {
      // Réinitialiser le formulaire pour un nouvel ajout
      setUsername('');
      setEmail('');
      setFirstName('');
      setLastName('');
      setRole('user');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AppUser = {
      id: user?.id || '', // L'ID sera généré par le parent si c'est un nouvel utilisateur
      username,
      email,
      firstName,
      lastName,
      role,
    };
    onSubmit(newUser);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4">{user ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
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
            <span className="material-icons mr-1 text-sm">{user ? 'update' : 'add'}</span> {user ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;