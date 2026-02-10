
export interface Service {
  id: string;
  title: string;
  category: string;
  professionalName: string;
  email: string;
  phone: string;
  description: string;
  location: 'Salvador' | 'Simões Filho' | 'Lauro de Freitas';
  neighborhood: string;
  hasPhysicalAddress?: boolean;
  address?: string;
  price?: string;
  imageUrl: string;
  images?: string[];
  starRating: number;
  planId: string;
  isPremiumVerified?: boolean;
  isTrialActive?: boolean; // Indica se está em degustação de 7 dias do plano Anual
  createdAt: number;
  expiryDate: number;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    kwai?: string;
    youtube?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

export interface AdminLog {
  id: string;
  timestamp: number;
  adminUser: string;
  action: string;
  details: string;
}
