import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: string;
  role: 'admin' | 'user';
  exp?: number; // Ajout de la propriété exp pour la date d'expiration du token
}

export interface AuthUser {
  _id: string;
  username: string;
  email?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { username: string; role: 'admin' | 'user' } | null;
  login: (username: string, password: string) => Promise<boolean>;
  // Mise à jour de la signature de la fonction register
  register: (username: string, email: string, password: string, role?: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ username: string; role: 'admin' | 'user' } | null>(null);

  const API_BASE_URL = 'https://project-backend-final-2.onrender.com/api'; // Remplacez par l'URL de votre API

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const storedUser = localStorage.getItem('currentUser');
    if (token && storedUser) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        if (decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          setIsAdmin(parsedUser.role === 'admin');
        } else {
          logout();
        }
      } catch (error) {
        console.error('Erreur de décodage du token ou token invalide:', error);
        logout();
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nom d\'utilisateur ou mot de passe incorrect.');
      }

      const data = await response.json();
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify({ username: data.username, role: data.role }));
      setUser({ username: data.username, role: data.role });
      setIsAuthenticated(true);
      setIsAdmin(data.role === 'admin');
      return true;
    } catch (error: unknown) {
      console.error('Erreur réseau ou autre lors de la connexion:', error);
      throw error;
    }
  };

  // Fonction register mise à jour pour accepter le rôle
  const register = async (username: string, email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }), // Inclure le rôle dans le corps de la requête
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de l\'inscription. Veuillez réessayer.');
      }

      const data = await response.json();
      // Si l'inscription réussit, connecte l'utilisateur immédiatement
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify({ username: data.username, role: data.role }));
      setUser({ username: data.username, role: data.role });
      setIsAuthenticated(true);
      setIsAdmin(data.role === 'admin');

      return true;
    } catch (error: unknown) {
      console.error('Erreur réseau ou autre lors de l\'inscription:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};