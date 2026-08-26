// questions.js
// As 8 perguntas do quiz. Cada opção soma pontos para 1 ou 2 arquétipos
// (chave = código do arquétipo em archetypes.js, valor = pontos).

const QUESTIONS = [
  {
    pergunta: 'Onde você mora?',
    opcoes: [
      { texto: 'Centro de uma capital grande e agitada', pontos: { CEO: 2, ZAP: 1 } },
      { texto: 'Bairro tranquilo de cidade média', pontos: { FAMILIA: 2, BOLETO: 1 } },
      { texto: 'Cidade do interior, todo mundo se conhece', pontos: { AGRO: 2, FAMILIA: 1 } },
      { texto: 'Zona rural, sítio ou fazenda', pontos: { AGRO: 2, VERDE: 1 } },
    ],
  },
  {
    pergunta: 'Sua situação de trabalho hoje:',
    opcoes: [
      { texto: 'CLT numa empresa, carteira assinada', pontos: { BOLETO: 2, FAMILIA: 1 } },
      { texto: 'Empreendedor(a)/dono do próprio negócio', pontos: { CEO: 2, AGRO: 1 } },
      { texto: 'Autônomo/freelancer, cada mês uma aventura', pontos: { ZAP: 1, VERDE: 1 } },
      { texto: 'Desempregado(a) ou estudando pra concurso', pontos: { BOLETO: 2, ZAP: 1 } },
    ],
  },
  {
    pergunta: 'Quando o boleto sobe, sua reação é:',
    opcoes: [
      { texto: 'Print e mando pro grupo da família reclamando', pontos: { ZAP: 2 } },
      { texto: 'Abro a planilha e recalculo tudo', pontos: { BOLETO: 2 } },
      { texto: 'Penso em como isso afeta produção/negócio', pontos: { AGRO: 1, CEO: 1 } },
      { texto: 'Fico puto mas sigo comprando orgânico', pontos: { VERDE: 2 } },
    ],
  },
  {
    pergunta: 'Sua prioridade nº1 pro país:',
    opcoes: [
      { texto: 'Economia estável, juro e imposto baixos', pontos: { BOLETO: 2 } },
      { texto: 'Meio ambiente e sustentabilidade', pontos: { VERDE: 2 } },
      { texto: 'Segurança e valores da família', pontos: { FAMILIA: 2 } },
      { texto: 'Menos governo, mais livre iniciativa', pontos: { CEO: 2 } },
    ],
  },
  {
    pergunta: 'Sexta à noite, você está:',
    opcoes: [
      { texto: 'Happy hour discutindo política com os amigos', pontos: { ZAP: 1, CEO: 1 } },
      { texto: 'Em casa com a família, algo tranquilo', pontos: { FAMILIA: 2 } },
      { texto: 'Numa live/evento sobre empreendedorismo', pontos: { CEO: 2 } },
      { texto: 'Cuidando do quintal ou da roça', pontos: { VERDE: 1, AGRO: 1 } },
    ],
  },
  {
    pergunta: 'Rede social que você mais usa:',
    opcoes: [
      { texto: 'WhatsApp (os grupos são minha vida)', pontos: { ZAP: 2 } },
      { texto: 'LinkedIn', pontos: { CEO: 2 } },
      { texto: 'Instagram, seguindo pauta ambiental/lifestyle', pontos: { VERDE: 2 } },
      { texto: 'Facebook, pra ver a família e a cidade', pontos: { FAMILIA: 1, AGRO: 1 } },
    ],
  },
  {
    pergunta: 'Pizza:',
    opcoes: [
      { texto: 'Com abacaxi, sem crise', pontos: { VERDE: 1 } },
      { texto: 'Só a tradicional, do jeito que sempre foi', pontos: { FAMILIA: 1, AGRO: 1 } },
      { texto: 'Depende da promoção', pontos: { BOLETO: 1 } },
      { texto: 'Pedi por app enquanto a reunião não acaba', pontos: { CEO: 1, ZAP: 1 } },
    ],
  },
  {
    pergunta: 'Se pudesse resolver 1 problema do Brasil amanhã:',
    opcoes: [
      { texto: 'Corrupção e gasto público', pontos: { BOLETO: 2, ZAP: 1 } },
      { texto: 'Desmatamento e crise climática', pontos: { VERDE: 2 } },
      { texto: 'Violência e segurança pública', pontos: { FAMILIA: 2, AGRO: 1 } },
      { texto: 'Burocracia que trava quem quer empreender', pontos: { CEO: 2 } },
    ],
  },
];
