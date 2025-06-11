export interface Equipment {
  id: string;
  name: string;
  type: 'Ordinateur' | 'Imprimante' | 'Serveur' | 'Réseau' | 'Autre';
  serialNumber: string;
  manufacturer: string;
  model: string;
  purchaseDate: string;
  warrantyEndDate: string;
  status: 'En service' | 'En panne' | 'En maintenance' | 'Hors service';
  assignedTo: string | null; // ID de l'utilisateur ou nom
  location: string;
  notes?: string;
}

export interface AppUser {
  id: string;
  username: string;
  role: 'admin' | 'user';
  email: string;
  firstName: string;
  lastName: string;
  // ... autres champs
}