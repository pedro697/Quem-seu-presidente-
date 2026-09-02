// archetypes.js
// Somente dados dos 6 "presidentes" fictícios do match. Nenhum tem relação com
// político, partido ou figura pública real — nomePresidente é só um personagem
// de brincadeira; o humor mira comportamento/hábito fictício, nunca raça, etnia,
// religião, gênero, orientação sexual ou classe social.
//
// Campo "caracteristicas": tags curtas usadas como fallback em "POR QUE DEU MATCH?"
// quando o usuário pulou propostas demais pra gerar motivos dinâmicos (ver script.js).

const ARCHETYPES = [
  {
    codigo: 'BOLETO',
    nomePresidente: 'Arthur Monteiro',
    nomePerfil: 'Fiscal do Boleto',
    emoji: '🧾',
    tagline: 'Juro baixo é meu amor, imposto alto é meu trauma.',
    descricao:
      'Você não precisa de pesquisa eleitoral. Precisa é de uma planilha. Cada aumento de preço é tratado como uma investigação federal e seu aplicativo do banco provavelmente é o lugar onde você passa mais tempo durante o mês.',
    caracteristicas: ['💰 Economia', '📊 Organização', '🧾 Controle de gastos'],
    corPrimaria: '#2563eb',
    corSecundaria: '#1d4ed8',
  },
  {
    codigo: 'VERDE',
    nomePresidente: 'Clara Vasconcelos',
    nomePerfil: 'Verde Militante',
    emoji: '🌱',
    tagline: 'Enquanto isso, o planeta pede socorro.',
    descricao:
      'Você olha para uma compra e imediatamente pensa no impacto ambiental dela. Provavelmente já julgou silenciosamente alguém por usar uma sacola plástica e considera sustentabilidade uma pauta que deveria estar na conversa de todo mundo.',
    caracteristicas: ['🌱 Sustentabilidade', '♻️ Meio ambiente', '⚡ Energia limpa'],
    corPrimaria: '#16a34a',
    corSecundaria: '#15803d',
  },
  {
    codigo: 'ZAP',
    nomePresidente: 'Rafael Duarte',
    nomePerfil: 'Populista do Zap',
    emoji: '📱',
    tagline: 'Vi no grupo da família, deve ser verdade.',
    descricao:
      "Você não acompanha as notícias. As notícias chegam até você no grupo da família. Seu feed é uma mistura de memes, áudios de três minutos e alguém dizendo que descobriu uma informação que 'a mídia não quer mostrar'.",
    caracteristicas: ['📱 Informação', '🗣️ Comunicação', '🔥 Opinião'],
    corPrimaria: '#f97316',
    corSecundaria: '#ea580c',
  },
  {
    codigo: 'CEO',
    nomePresidente: 'Lucas Almeida',
    nomePerfil: 'CEO de LinkedIn',
    emoji: '🏢',
    tagline: 'Brasil precisa de mais "mindset de dono".',
    descricao:
      'Você acredita que praticamente qualquer problema pode ser resolvido com inovação, eficiência e uma boa apresentação de PowerPoint. Talvez você não tenha uma empresa, mas já tem um post pronto sobre liderança.',
    caracteristicas: ['🚀 Empreendedorismo', '📈 Crescimento', '💼 Inovação'],
    corPrimaria: '#7c3aed',
    corSecundaria: '#6d28d9',
  },
  {
    codigo: 'AGRO',
    nomePresidente: 'Miguel Andrade',
    nomePerfil: 'Coronel do Agro',
    emoji: '🚜',
    tagline: 'Trator não erra, política que atrapalha.',
    descricao:
      "Você mede o progresso em produtividade, hectares e potência do maquinário. Se alguém disser que uma solução é complicada, sua primeira pergunta provavelmente será: 'Mas isso funciona na prática?'",
    caracteristicas: ['🚜 Produção', '🌾 Campo', '📈 Eficiência'],
    corPrimaria: '#b45309',
    corSecundaria: '#92400e',
  },
  {
    codigo: 'FAMILIA',
    nomePresidente: 'Gabriel Martins',
    nomePerfil: 'Guardião da Família',
    emoji: '🙏',
    tagline: 'Antes de mudar o Brasil, quero saber quem cuida da minha rua.',
    descricao:
      'Você prefere resolver o problema que está na sua frente antes de tentar consertar o país inteiro. Família, segurança e tranquilidade estão no topo da lista — e você provavelmente sabe exatamente o que está acontecendo na sua vizinhança.',
    caracteristicas: ['🏠 Comunidade', '🛡️ Segurança', '👨‍👩‍👧 Família'],
    corPrimaria: '#e11d48',
    corSecundaria: '#be123c',
  },
];
