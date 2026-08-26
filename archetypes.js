// archetypes.js
// Somente dados dos 6 arquétipos fictícios de eleitor. Nenhum tem relação com
// político, partido ou figura pública real — o humor mira comportamento/hábito
// fictício, nunca raça, etnia, religião, gênero, orientação sexual ou classe social.
//
// Campo "caracteristicas": não fazia parte da lista de campos do documento-fonte,
// mas foi adicionado porque a tela de resultado (seção 13 do prompt) pede
// "3 características engraçadas" por arquétipo — autoral, no mesmo tom da descrição.

const ARCHETYPES = [
  {
    codigo: 'BOLETO',
    emoji: '🧾',
    nome: 'O Fiscal do Boleto',
    tagline: 'Juro baixo é meu amor, imposto alto é meu trauma.',
    descricao:
      'Você não precisa de pesquisa eleitoral. Precisa é de uma planilha. Cada aumento de preço é tratado como uma investigação federal e seu aplicativo do banco provavelmente é o lugar onde você passa mais tempo durante o mês.',
    caracteristicas: [
      'Sabe de cor a taxa Selic atual',
      'Trata todo boleto como uma investigação pessoal',
      'Já discutiu com o app do banco por causa de R$0,03 de tarifa',
    ],
    corPrimaria: '#2563eb',
    corSecundaria: '#1d4ed8',
  },
  {
    codigo: 'VERDE',
    emoji: '🌱',
    nome: 'O Verde Militante',
    tagline: 'Enquanto isso, o planeta pede socorro.',
    descricao:
      'Você olha para uma compra e imediatamente pensa no impacto ambiental dela. Provavelmente já julgou silenciosamente alguém por usar uma sacola plástica e considera sustentabilidade uma pauta que deveria estar na conversa de todo mundo.',
    caracteristicas: [
      'Separa o lixo reciclável com precisão cirúrgica',
      'Já quase discutiu por causa de canudo de plástico',
      'Tem pelo menos uma planta com nome próprio',
    ],
    corPrimaria: '#16a34a',
    corSecundaria: '#15803d',
  },
  {
    codigo: 'ZAP',
    emoji: '📱',
    nome: 'O Populista do Zap',
    tagline: 'Vi no grupo da família, deve ser verdade.',
    descricao:
      "Você não acompanha as notícias. As notícias chegam até você no grupo da família. Seu feed é uma mistura de memes, áudios de três minutos e alguém dizendo que descobriu uma informação que 'a mídia não quer mostrar'.",
    caracteristicas: [
      'Recebe a notícia antes dela virar notícia',
      'Áudio de 5 minutos pra você é resumo',
      'Confia mais no cunhado do que no jornal',
    ],
    corPrimaria: '#f97316',
    corSecundaria: '#ea580c',
  },
  {
    codigo: 'CEO',
    emoji: '🏢',
    nome: 'O CEO de LinkedIn',
    tagline: 'Brasil precisa de mais "mindset de dono".',
    descricao:
      'Você acredita que praticamente qualquer problema pode ser resolvido com inovação, eficiência e uma boa apresentação de PowerPoint. Talvez você não tenha uma empresa, mas já tem um post pronto sobre liderança.',
    caracteristicas: [
      'Já usou a palavra "sinergia" numa conversa de família',
      'Acorda às 5h só pra postar sobre acordar às 5h',
      'Resolveria a crise hídrica com um pitch deck',
    ],
    corPrimaria: '#7c3aed',
    corSecundaria: '#6d28d9',
  },
  {
    codigo: 'AGRO',
    emoji: '🚜',
    nome: 'O Coronel do Agro',
    tagline: 'Trator não erra, política que atrapalha.',
    descricao:
      "Você mede o progresso em produtividade, hectares e potência do maquinário. Se alguém disser que uma solução é complicada, sua primeira pergunta provavelmente será: 'Mas isso funciona na prática?'",
    caracteristicas: [
      'Sabe a previsão do tempo dos próximos 10 dias de cabeça',
      'O trator tem nome e provavelmente mais fãs que você',
      'Resolve tudo "na prática", sem enrolação',
    ],
    corPrimaria: '#b45309',
    corSecundaria: '#92400e',
  },
  {
    codigo: 'FAMILIA',
    emoji: '🙏',
    nome: 'O Guardião da Família',
    tagline: 'Antes de mudar o Brasil, quero saber quem cuida da minha rua.',
    descricao:
      'Você prefere resolver o problema que está na sua frente antes de tentar consertar o país inteiro. Família, segurança e tranquilidade estão no topo da lista — e você provavelmente sabe exatamente o que está acontecendo na sua vizinhança.',
    caracteristicas: [
      'Sabe o nome de todo mundo da rua',
      'Tranquilidade em casa vale mais que qualquer debate nacional',
      'Reza (ou torce) antes de qualquer decisão importante',
    ],
    corPrimaria: '#e11d48',
    corSecundaria: '#be123c',
  },
];
