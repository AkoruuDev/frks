import type { ObjectiveType } from './types';
import { ObjectiveType as ObjectiveTypeConst } from './types';

// Livros do Arsenal Tático
export const BOOK_ARSENAL = [
  {
    title: "O Artista do Perdedor",
    author: "Steven Pressfield",
    category: "MENTALIDADE",
    desc: "A resistência é a força invisível que sabota seus planos. Este livro ensina a derrotar o inimigo interno."
  },
  {
    title: "Homem em Busca de Sentido",
    author: "Viktor Frankl",
    category: "PROPÓSITO",
    desc: "Mesmo na escuridão absoluta, a vida tem sentido. A escolha é sempre sua."
  },
  {
    title: "Disciplina é Destino",
    author: "Jocko Willink",
    category: "GUERRA",
    desc: "Disciplina é liberdade. Sem ela, você é escravo dos instintos. Com ela, você é imparável."
  },
  {
    title: "O Princípio Pareto",
    author: "Richard Koch",
    category: "EFICIÊNCIA",
    desc: "80% dos seus resultados vêm de 20% do seu esforço. Encontre esses 20% e trabalhe neles."
  },
  {
    title: "Mentalidade de Crescimento",
    author: "Carol Dweck",
    category: "DESENVOLVIMENTO",
    desc: "Talento é apenas o começo. O crescimento vem da crença em sua capacidade de evoluir."
  },
  {
    title: "Metabolismo Lento",
    author: "David Sinclair",
    category: "BIOLOGIA",
    desc: "Seu corpo aguenta muito mais. A maioria das limitações são mentais, não fisiológicas."
  },
  {
    title: "O Dinheiro Mestre",
    author: "Tony Robbins",
    category: "FINANÇAS",
    desc: "Riqueza não é acidental. É resultado de decisões sistemáticas e execução implacável."
  },
  {
    title: "Hábitos Atômicos",
    author: "James Clear",
    category: "HÁBITOS",
    desc: "Pequenas mudanças, resultados extraordinários. A consistência bate a intensidade sempre."
  },
  {
    title: "Minimalismo Digital",
    author: "Cal Newport",
    category: "FOCO",
    desc: "Apps roubam sua atenção. Recupere-a. A clareza mental é um superpoder raro."
  },
  {
    title: "O Código de Riqueza",
    author: "George Clason",
    category: "ABUNDÂNCIA",
    desc: "Riqueza segue princípios anteigos. O primeiro é: guarde parte do que ganha."
  }
];

// Tarefas Iniciais por Objetivo
export const INITIAL_TASKS: Record<ObjectiveType, Record<string, boolean>> = {
  [ObjectiveTypeConst.PHYSICAL]: {
    "Aquecimento pré-treino": false,
    "Série de força (pernas, peito ou costas)": false,
    "30min cardio intenso": false,
    "Alongamento pós-treino": false,
    "Hidratação (3+ litros)": false,
    "Refeição protéica": false,
    "Qualidade de sono 7-8h": false
  },
  [ObjectiveTypeConst.INTELLECTUAL]: {
    "Leitura profunda 60min": false,
    "Resumo do capítulo lido": false,
    "Estudo de novo conceito": false,
    "Implementação prática (Deep Work)": false,
    "Revisão de anotações": false,
    "Discussão / ensino para alguém": false,
    "Reflexão sobre aprendizados": false
  },
  [ObjectiveTypeConst.FINANCIAL]: {
    "Rastreamento de gastos": false,
    "Revisão de transações do dia": false,
    "Contribuição para fundo de emergência": false,
    "Análise de rentabilidade": false,
    "Planejamento de investimentos": false,
    "Educação financeira 30min": false,
    "Reflexão sobre metas": false
  }
};
