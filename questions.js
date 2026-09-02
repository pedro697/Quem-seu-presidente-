// questions.js
// Somente as propostas do quiz (mecânica de match) e seus pesos por arquétipo.
// Cada proposta pertence a uma categoria (usada na barra "SEU PERFIL" do resultado)
// e tem um "rotulo" curto (usado em "POR QUE DEU MATCH?"). Nenhuma proposta cita
// pessoa, partido ou candidato real — são afirmações neutras e fictícias.
//
// Modelo de pontuação v2: cada proposta tem um trade-off explícito (SIM e NÃO são
// escolhas reais, não consensuais). Quem "concorda" com a proposta ganha +1 se o
// usuário responde SIM e -1 se responde NÃO; quem "discorda" é o espelho disso
// (+1 no NÃO, -1 no SIM). Arquétipos não listados ficam neutros (0) na pergunta.
//
// Formato de cada proposta:
// { id, categoria, texto, rotulo, sim: {CODIGO: pontos}, nao: {CODIGO: pontos}, pular: {} }
// "pular" nunca soma pontos — existe só pra deixar o formato de dados explícito.

// Metadados de exibição de cada categoria (emoji + nome), usados na barra "SEU PERFIL".
const CATEGORIA_INFO = {
  economia: { emoji: '💰', nome: 'Economia' },
  meio_ambiente: { emoji: '🌱', nome: 'Meio ambiente' },
  empreendedorismo: { emoji: '🏢', nome: 'Empreendedorismo' },
  seguranca: { emoji: '🛡️', nome: 'Segurança' },
  comunicacao: { emoji: '📱', nome: 'Comunicação' },
  campo: { emoji: '🚜', nome: 'Campo' },
};

const QUESTIONS = [
  {
    id: 1,
    categoria: 'economia',
    texto: 'Reduzir bastante o Bolsa Família e outros programas sociais pra abrir espaço no orçamento e baixar impostos.',
    rotulo: 'Corte de programas sociais',
    sim: { BOLETO: 1, CEO: 1, FAMILIA: -1, ZAP: -1 },
    nao: { BOLETO: -1, CEO: -1, FAMILIA: 1, ZAP: 1 },
    pular: {},
  },
  {
    id: 2,
    categoria: 'economia',
    texto: 'Aumentar impostos de quem ganha mais pra bancar mais programas sociais.',
    rotulo: 'Taxar quem ganha mais',
    sim: { VERDE: 1, ZAP: 1, BOLETO: -1, CEO: -1, AGRO: -1 },
    nao: { VERDE: -1, ZAP: -1, BOLETO: 1, CEO: 1, AGRO: 1 },
    pular: {},
  },
  {
    id: 3,
    categoria: 'meio_ambiente',
    texto: 'Proibir novas áreas de desmatamento pra agropecuária, mesmo reduzindo a produção agrícola no curto prazo.',
    rotulo: 'Fim de novo desmatamento',
    sim: { VERDE: 1, AGRO: -1, CEO: -1 },
    nao: { VERDE: -1, AGRO: 1, CEO: 1 },
    pular: {},
  },
  {
    id: 4,
    categoria: 'meio_ambiente',
    texto: 'Priorizar crescimento e emprego mesmo que isso signifique flexibilizar regras ambientais.',
    rotulo: 'Crescimento acima da regra ambiental',
    sim: { CEO: 1, AGRO: 1, BOLETO: 1, VERDE: -1 },
    nao: { CEO: -1, AGRO: -1, BOLETO: -1, VERDE: 1 },
    pular: {},
  },
  {
    id: 5,
    categoria: 'empreendedorismo',
    texto: 'Reduzir a fiscalização trabalhista sobre pequenas empresas pra facilitar contratação, com menos proteção ao trabalhador.',
    rotulo: 'Menos fiscalização trabalhista',
    sim: { CEO: 1, BOLETO: 1, FAMILIA: -1, ZAP: -1 },
    nao: { CEO: -1, BOLETO: -1, FAMILIA: 1, ZAP: 1 },
    pular: {},
  },
  {
    id: 6,
    categoria: 'empreendedorismo',
    texto: 'Criar mais regras de proteção ao trabalhador, mesmo que fique mais caro contratar.',
    rotulo: 'Mais proteção trabalhista',
    sim: { FAMILIA: 1, ZAP: 1, CEO: -1, BOLETO: -1 },
    nao: { FAMILIA: -1, ZAP: -1, CEO: 1, BOLETO: 1 },
    pular: {},
  },
  {
    id: 7,
    categoria: 'seguranca',
    texto: 'Aumentar bastante o efetivo policial, mesmo cortando orçamento de educação ou saúde pra isso.',
    rotulo: 'Mais policiamento',
    sim: { FAMILIA: 1, ZAP: 1, VERDE: -1 },
    nao: { FAMILIA: -1, ZAP: -1, VERDE: 1 },
    pular: {},
  },
  {
    id: 8,
    categoria: 'seguranca',
    texto: 'Priorizar prevenção social (educação, esporte, renda) em vez de mais policiamento como resposta ao crime.',
    rotulo: 'Prevenção social',
    sim: { VERDE: 1, FAMILIA: -1, ZAP: -1 },
    nao: { VERDE: -1, FAMILIA: 1, ZAP: 1 },
    pular: {},
  },
  {
    id: 9,
    categoria: 'comunicacao',
    texto: 'O governo poder monitorar mais as redes pra combater fake news, mesmo limitando um pouco a liberdade de expressão.',
    rotulo: 'Monitorar redes sociais',
    sim: { FAMILIA: 1, ZAP: -1, CEO: -1 },
    nao: { FAMILIA: -1, ZAP: 1, CEO: 1 },
    pular: {},
  },
  {
    id: 10,
    categoria: 'comunicacao',
    texto: 'Cortar gastos do governo com marketing institucional, mesmo reduzindo a visibilidade de campanhas públicas úteis.',
    rotulo: 'Corte de marketing institucional',
    sim: { BOLETO: 1, CEO: 1, ZAP: -1 },
    nao: { BOLETO: -1, CEO: -1, ZAP: 1 },
    pular: {},
  },
  {
    id: 11,
    categoria: 'campo',
    texto: 'Priorizar grandes exportações do agronegócio, mesmo concentrando mais terra e renda no setor.',
    rotulo: 'Exportação do agronegócio',
    sim: { AGRO: 1, CEO: 1, VERDE: -1, ZAP: -1 },
    nao: { AGRO: -1, CEO: -1, VERDE: 1, ZAP: 1 },
    pular: {},
  },
  {
    id: 12,
    categoria: 'campo',
    texto: 'Priorizar reforma agrária e distribuição de terra pra pequenos agricultores, reduzindo área das grandes propriedades.',
    rotulo: 'Reforma agrária',
    sim: { VERDE: 1, ZAP: 1, AGRO: -1, CEO: -1 },
    nao: { VERDE: -1, ZAP: -1, AGRO: 1, CEO: 1 },
    pular: {},
  },
];
