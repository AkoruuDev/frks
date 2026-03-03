import type { ObjectiveType, IdentityMode } from '../types';
import { ObjectiveType as ObjectiveTypeConst, IdentityMode as IdentityModeConst } from '../types';

// Simulação de dados para diferentes objetivos e modos
const briefings: Record<ObjectiveType, Record<IdentityMode, string[]>> = {
  [ObjectiveTypeConst.PHYSICAL]: {
    [IdentityModeConst.TRACKER]: [
      "Seu corpo é uma máquina. Aqueça-a, trabalhe-a e recupere-se. Consistência vence talento.",
      "Dor é fraqueza deixando o corpo. Cada sessão de treino constrói a versão melhor de você.",
      "A força não vem da genética, vem da repetição. Um freak treina quando ninguém está olhando."
    ],
    [IdentityModeConst.MONK]: [
      "Silêncio total. Foco profundo. Seu corpo é o templo. Cada movimento conta.",
      "Ascese pela disciplina. O corpo aguenta muito mais que a mente permite. Quebre seus limites.",
      "Modo caverna ativado. Sem distrações, sem desculpas. Apenas você e o treino."
    ],
    [IdentityModeConst.DARK]: [
      "OBSESSÃO TOTAL. Seu corpo é uma arma. Polir a arma é prioridade estratégica.",
      "Limite extremo. Você não treina, você se forja. A dor é feedback da transformação.",
      "Nenhuma desculpa. Nenhuma clemência. Você é o que seus músculos dizem que você é."
    ]
  },
  [ObjectiveTypeConst.INTELLECTUAL]: {
    [IdentityModeConst.TRACKER]: [
      "A mente é o verdadeiro campo de batalha. Leia com intenção, aprenda com propósito.",
      "Cada livro é uma arma tática. Estude os mestres. Implemente as lições.",
      "Deep work é o superpoder do século XXI. Foco profundo derrota talento raso."
    ],
    [IdentityModeConst.MONK]: [
      "Silêncio para ouvir a sabedoria. Estude como um monge estuda as escrituras.",
      "Confinamento mental. Sem distrações baratas. Apenas conhecimento absoluto.",
      "A mente calma penetra os mistérios. Medite na leitura. Integre a aprendizagem à sua essência."
    ],
    [IdentityModeConst.DARK]: [
      "ACUMULAÇÃO DE ARMAS MENTAIS. Cada livro é um artifato de poder.",
      "Nenhum conhecimento é acidental. Você estuda para dominar, não para passar.",
      "A ignorância é morte estratégica. Você lê como um general planeja campanhas."
    ]
  },
  [ObjectiveTypeConst.FINANCIAL]: {
    [IdentityModeConst.TRACKER]: [
      "Cada centavo é uma escolha. Controle o fluxo, controle o futuro.",
      "A abundância vem da obsessão pelos números. Você não gasta, você investe.",
      "Paciência e disciplina geram riqueza. Freaks constroem patrimônio, não gastam salário."
    ],
    [IdentityModeConst.MONK]: [
      "Monges compreendem abundância através da escassez. Cada gasto é uma decisão espiritual.",
      "Liberdade financeira é liberdade espiritual. Cultive paciência. Os juros compostos rezam por você.",
      "Renúncia ao conforto agora. Poder absoluto depois. Este é o caminho."
    ],
    [IdentityModeConst.DARK]: [
      "OBSESSÃO TOTAL. Dinheiro é poder. Você não economiza, você acumula poder.",
      "Sem limites éticos de gasto. Sem justificativas. Apenas eficiência e rentabilidade.",
      "Sua carteira é um reflexo da sua vontade. Crescimento exponencial é o único resultado aceitável."
    ]
  }
};

/**
 * Obtém um briefing tático gerado pela IA baseado no objetivo e modo de identidade
 * @param objective - Tipo de objetivo do usuário (PHYSICAL, INTELLECTUAL, FINANCIAL)
 * @param userMode - Modo de identidade (TRACKER, MONK, DARK)
 * @returns Promise com uma string de briefing motivacional
 */
export async function getTacticalBriefing(
  objective: ObjectiveType | null,
  userMode: IdentityMode
): Promise<string> {
  // Validação
  if (!objective || !briefings[objective] || !briefings[objective][userMode]) {
    return "A guerra espera por sua decisão. Escolha o seu caminho e persista.";
  }

  // Simular latência de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Selecionar um briefing aleatório para a combinação objetivo + modo
  const availableBriefings = briefings[objective][userMode];
  const randomIndex = Math.floor(Math.random() * availableBriefings.length);

  return availableBriefings[randomIndex];
}
