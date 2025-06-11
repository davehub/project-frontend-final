import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user'); // Ajout de l'état pour le rôle
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      // Passer le rôle à la fonction register
      const isRegistered = await register(username, email, password, role);
      if (isRegistered) {
        setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Cela devrait être géré par le catch en général, mais laissé ici pour la clarté
        setError('Échec de l\'inscription. Veuillez réessayer.');
      }
    } catch (err: unknown) {
      // Le message d'erreur du backend est maintenant capturé ici
      if (err instanceof Error) {
        setError(err.message || 'Une erreur inattendue est survenue lors de l\'inscription.');
      } else {
        setError('Une erreur inattendue est survenue lors de l\'inscription.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">S'inscrire</h2>
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Nom d'utilisateur
            </label>
            <div className="flex items-center border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <span className="material-icons mr-2">person</span>
              <input
                type="text"
                id="username"
                className="appearance-none border-none w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none"
                placeholder="Votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="flex items-center border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <span className="material-icons mr-2">email</span>
              <input
                type="email"
                id="email"
                className="appearance-none border-none w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Mot de passe
            </label>
            <div className="flex items-center border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <span className="material-icons mr-2">lock</span>
              <input
                type="password"
                id="password"
                className="appearance-none border-none w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>
            <div className="flex items-center border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <span className="material-icons mr-2">lock_reset</span>
              <input
                type="password"
                id="confirmPassword"
                className="appearance-none border-none w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* ATTENTION: Section à retirer pour une application en production ! */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Rôle (pour démo/développement seulement)
            </label>
            <div className="flex items-center border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <span className="material-icons mr-2">vpn_key</span>
              <select
                id="role"
                className="appearance-none border-none w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                required
              >
                <option value="user">Utilisateur standard</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>
          {/* FIN ATTENTION */}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
            >
              <span className="material-icons mr-2">person_add</span> S'inscrire
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 text-sm mt-4">
          Déjà un compte ?{' '}
          <NavLink to="/login" className="text-blue-500 hover:text-blue-800 font-bold">
            Se connecter ici
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;