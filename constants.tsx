
export const CITIES = ['Salvador', 'Simões Filho', 'Lauro de Freitas'] as const;

export const NEIGHBORHOODS: Record<string, string[]> = {
  'Salvador': ['Pituba', 'Barra', 'Imbuí', 'Caminho das Árvores', 'Itapuã', 'Stella Maris', 'Rio Vermelho', 'Graça', 'Liberdade', 'Cajazeiras', 'Brotas', 'Cabula', 'Paripe', 'São Caetano'],
  'Simões Filho': ['Centro', 'Cia I', 'Cia II', 'Ponto Parada', 'Mapele', 'Km 25', 'Vida Nova', 'Eucalipto', 'Pitanguinha'],
  'Lauro de Freitas': ['Vilas do Atlântico', 'Ipitanga', 'Buraquinho', 'Miragem', 'Estrada do Coco', 'Portão', 'Areia Branca', 'Itinga', 'Loteamento Miragem', 'Vida Nova']
};

export const CATEGORIES_WITH_ICONS = [
  { name: 'Manutenção', icon: 'fa-screwdriver-wrench' },
  { name: 'Beleza', icon: 'fa-sparkles' },
  { name: 'Aulas', icon: 'fa-book-open-reader' },
  { name: 'Tecnologia', icon: 'fa-laptop-code' },
  { name: 'Saúde', icon: 'fa-stethoscope' },
  { name: 'Gastronomia', icon: 'fa-utensils' },
  { name: 'Limpeza', icon: 'fa-broom' },
  { name: 'Eventos', icon: 'fa-camera-retro' },
  { name: 'Fretes', icon: 'fa-truck-fast' },
  { name: 'Moda', icon: 'fa-shirt' },
  { name: 'Pet', icon: 'fa-paw' }
];

export const CATEGORIES = CATEGORIES_WITH_ICONS.map(c => c.name);

export interface Plan {
  id: string;
  name: string;
  price: number;
  days: number;
  desc: string;
  icon: string;
  maxPhotos: number;
  highlight?: boolean;
  benefits: string[];
}

export const INITIAL_PLANS: Plan[] = [
  { 
    id: 'free', 
    name: '7 Dias Free', 
    price: 0, 
    days: 7, 
    desc: 'Básico para quem está começando.',
    icon: 'fa-seedling',
    maxPhotos: 1,
    benefits: ['Anúncio simples', '1 foto na galeria', 'Suporte via Chatbot']
  },
  { 
    id: 'monthly', 
    name: 'Mensal', 
    price: 19.90, 
    days: 30, 
    desc: 'Visibilidade para impulsionar seu mês.',
    icon: 'fa-calendar-day',
    maxPhotos: 1,
    benefits: ['Anúncio completo', 'Link redes sociais', 'IA Assistente de texto']
  },
  { 
    id: 'quarterly', 
    name: 'Trimestral', 
    price: 49.90, 
    days: 90, 
    desc: 'Ideal para estabilizar sua agenda.',
    icon: 'fa-layer-group',
    maxPhotos: 3,
    benefits: ['Destaque regional', 'Até 3 fotos', 'IA Hub Pro básico']
  },
  { 
    id: 'semiannual', 
    name: 'Semestral', 
    price: 89.90, 
    days: 180, 
    desc: 'Profissionalismo por longo prazo.',
    icon: 'fa-gem',
    maxPhotos: 5,
    benefits: ['Selo Prata', 'Prioridade média', 'IA Hub Pro completo']
  },
  { 
    id: 'annual', 
    name: 'Anual (Ouro)', 
    price: 149.90, 
    days: 365, 
    desc: 'Ouro: Máxima visibilidade e credibilidade.',
    icon: 'fa-crown',
    maxPhotos: 10,
    highlight: true,
    benefits: ['Selo Ouro Verificado', 'Topo das buscas', 'Até 10 fotos', 'Assessoria de Marketing']
  }
];

export let PLANS = [...INITIAL_PLANS];
