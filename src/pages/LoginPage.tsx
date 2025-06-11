import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom'; // Importe NavLink pour les liens internes
import { useAuth } from '../context/AuthContext';
 // S'assurer que les icônes sont importées

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Si l'utilisateur est déjà authentifié, le rediriger vers le tableau de bord approprié
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/user');
    }
  }, [isAuthenticated, isAdmin, navigate]); // Dépendances pour le useEffect

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Réinitialise l'erreur à chaque soumission du formulaire
    try {
      const success = await login(username, password);
      if (!success) {
        // Le message d'erreur est géré par la fonction login elle-même et levé comme une erreur
        // Ici, on attrape simplement l'erreur et on affiche un message générique si besoin,
        // ou on laisse la logique de login remonter un message spécifique.
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
      }
      // La redirection est gérée par le useEffect si la connexion réussit
    } catch (err: unknown) {
      // Pour attraper les erreurs lancées par la fonction login (par exemple, erreur réseau)
      if (err instanceof Error) {
        setError(err.message || 'Une erreur inattendue est survenue lors de la connexion.');
      } else {
        setError('Une erreur inattendue est survenue lors de la connexion.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
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
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
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
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Se connecter
            </button>
          </div>
        </form>
        {/* Section pour les liens d'inscription et mot de passe oublié */}
        <div className="flex flex-col items-center justify-center text-sm mt-4 space-y-2">
          <NavLink to="/register" className="text-blue-500 hover:text-blue-800 font-bold">
            Pas encore de compte ? S'inscrire
          </NavLink>
          {/* Le lien pour "Mot de passe oublié" ne mène nulle part pour l'instant */}
          <NavLink to="/forgot-password" className="text-gray-500 hover:text-gray-700">
            Mot de passe oublié ?
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;