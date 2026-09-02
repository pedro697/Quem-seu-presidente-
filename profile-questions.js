// profile-questions.js
// Somente as perguntas de perfil (dados demográficos/comportamentais agregados).
// IMPORTANTE: essas respostas NUNCA entram no cálculo do match — servem só pra
// analytics e pra enriquecer o lead. Ver seção 12 do prompt da V2.

const PROFILE_QUESTIONS = [
  {
    chave: 'faixaEtaria',
    pergunta: 'Qual faixa representa você?',
    opcoes: [
      { valor: 'menos_18', texto: 'Menos de 18' },
      { valor: '18_24', texto: '18–24' },
      { valor: '25_34', texto: '25–34' },
      { valor: '35_44', texto: '35–44' },
      { valor: '45_54', texto: '45–54' },
      { valor: '55_mais', texto: '55+' },
    ],
  },
  {
    chave: 'situacao',
    pergunta: 'Hoje você está mais próximo de qual situação?',
    opcoes: [
      { valor: 'estudando', texto: '🎓 Estudando' },
      { valor: 'empresa', texto: '💼 Trabalhando em empresa' },
      { valor: 'empreendendo', texto: '🚀 Empreendendo' },
      { valor: 'autonomo', texto: '🧑‍💻 Autônomo/freelancer' },
      { valor: 'procurando', texto: '🔎 Procurando oportunidade' },
      { valor: 'outro', texto: '📌 Outro' },
    ],
  },
  {
    chave: 'localizacaoTipo',
    pergunta: 'Qual ambiente mais combina com onde você mora?',
    opcoes: [
      { valor: 'capital', texto: '🏙️ Capital/região metropolitana' },
      { valor: 'cidade_media', texto: '🌆 Cidade média' },
      { valor: 'interior', texto: '🌳 Interior' },
      { valor: 'zona_rural', texto: '🚜 Zona rural' },
    ],
  },
  {
    chave: 'plataforma',
    pergunta: 'Onde você mais passa tempo?',
    opcoes: [
      { valor: 'instagram', texto: 'Instagram' },
      { valor: 'tiktok', texto: 'TikTok' },
      { valor: 'whatsapp', texto: 'WhatsApp' },
      { valor: 'youtube', texto: 'YouTube' },
      { valor: 'facebook', texto: 'Facebook' },
      { valor: 'outra', texto: 'Outra' },
    ],
  },
];
