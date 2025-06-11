import React from 'react';
import type { AppUser } from '../../types';


interface UserListProps {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean; // Pour gérer les permissions d'affichage
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete, isAdmin }) => {
  return (
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
                {isAdmin && (
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                )}
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
                  {isAdmin && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => onEdit(user)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100">
                          <span className="material-icons">edit</span>
                        </button>
                        <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
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

export default UserList;