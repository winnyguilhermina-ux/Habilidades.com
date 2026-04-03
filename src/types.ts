export interface Curso {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
}

export interface Profissional {
  id?: string;
  nomeCompleto: string;
  whatsapp: string;
  cidade: string;
  cursoId: string;
  experiencia: string;
  certificado: boolean;
  biografia: string;
  oQueEnsina: string;
  modalidade: 'online' | 'presencial' | 'ambos';
  preco: number;
  portfolioUrl?: string;
  fotoUrl?: string;
  destaque?: boolean;
  verificado?: boolean;
}

export interface Inscricao {
  id?: string;
  nomeCompleto: string;
  whatsapp: string;
  cidade: string;
  cursoId: string;
  profissionalId: string;
  modalidade: string;
  disponibilidade: string;
  observacao?: string;
  createdAt: string;
}
