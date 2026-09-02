// script.js
// Estado da aplicação, navegação, pontuação/match, analytics e compartilhamento.
// Depende de ARCHETYPES (archetypes.js), QUESTIONS + CATEGORIA_INFO (questions.js),
// PROFILE_QUESTIONS (profile-questions.js) e submitLead (lead-handler.js).
// Tudo dentro de uma IIFE pra não vazar variáveis desnecessárias no escopo global.

(function () {
  'use strict';

  // ---------- Preferência de movimento reduzido (acessibilidade) ----------
  const prefereReduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Estado do quiz ----------
  let faseAtual = 'propostas'; // 'propostas' | 'perfil' — controla o que a tela genérica de perguntas renderiza
  let indicePropostas = 0;
  let indicePerfil = 0;
  let respostasPropostas = new Array(QUESTIONS.length).fill(null); // 'sim' | 'nao' | 'pular' | null
  let respostasPerfilIndices = new Array(PROFILE_QUESTIONS.length).fill(null); // índice da opção escolhida
  let nomeUsuario = '';
  let resultadoFinal = null; // { arquetipo, compatibilidade }, calculado uma única vez ao fim do perfil
  let bloqueadoAvanco = false; // evita cliques múltiplos disparando avanços duplicados
  let enviandoLead = false; // evita duplo envio do formulário de lead

  // ---------- Elementos das telas ----------
  const telaInicio = document.getElementById('tela-inicio');
  const telaExplicacao = document.getElementById('tela-explicacao');
  const telaPerguntas = document.getElementById('tela-perguntas');
  const telaPerfilTransicao = document.getElementById('tela-perfil-transicao');
  const telaNome = document.getElementById('tela-nome');
  const telaLead = document.getElementById('tela-lead');
  const telaAnalisando = document.getElementById('tela-analisando');
  const telaResultado = document.getElementById('tela-resultado');
  const telas = [
    telaInicio,
    telaExplicacao,
    telaPerguntas,
    telaPerfilTransicao,
    telaNome,
    telaLead,
    telaAnalisando,
    telaResultado,
  ];

  // ---------- Elementos da tela de perguntas (compartilhada entre propostas e perfil) ----------
  const btnVoltar = document.getElementById('btn-voltar');
  const barraProgresso = document.getElementById('barra-progresso');
  const conteudoPergunta = document.getElementById('conteudo-pergunta');
  const contadorPerguntas = document.getElementById('contador-perguntas');
  const categoriaChip = document.getElementById('categoria-chip');
  const textoPergunta = document.getElementById('texto-pergunta');
  const areaResposta = document.getElementById('area-resposta');

  // ---------- Elementos da tela de nome ----------
  const formNome = document.getElementById('form-nome');
  const inputNomeUsuario = document.getElementById('input-nome-usuario');
  const erroNomeUsuario = document.getElementById('erro-nome-usuario');

  // ---------- Elementos da tela de lead ----------
  const formLead = document.getElementById('form-lead');
  const inputWhatsapp = document.getElementById('input-whatsapp');
  const inputEmail = document.getElementById('input-email');
  const erroWhatsapp = document.getElementById('erro-whatsapp');
  const erroEmail = document.getElementById('erro-email');
  const btnEnviarLead = document.getElementById('btn-enviar-lead');
  const linkPular = document.getElementById('link-pular');

  // ---------- Elementos da tela de análise ----------
  const textoAnalisando = document.getElementById('texto-analisando');

  // ---------- Elementos da tela de resultado ----------
  const cardResultado = document.getElementById('card-resultado');
  const introResultado = document.getElementById('intro-resultado');
  const resultadoEmoji = document.getElementById('resultado-emoji');
  const resultadoNomePresidente = document.getElementById('resultado-nome-presidente');
  const resultadoNomePerfil = document.getElementById('resultado-nome-perfil');
  const resultadoCompatibilidade = document.getElementById('resultado-compatibilidade');
  const resultadoTagline = document.getElementById('resultado-tagline');
  const listaCategorias = document.getElementById('lista-categorias');
  const listaMotivos = document.getElementById('lista-motivos');
  const btnCompartilhar = document.getElementById('btn-compartilhar');
  const btnRefazer = document.getElementById('btn-refazer');
  const feedbackCompartilhar = document.getElementById('feedback-compartilhar');

  // ---------- Navegação entre telas ----------
  function mostrarTela(telaAlvo) {
    telas.forEach((tela) => {
      tela.classList.toggle('tela-ativa', tela === telaAlvo);
    });
    window.scrollTo({ top: 0, behavior: prefereReduzirMovimento ? 'auto' : 'smooth' });
  }

  // ---------- Reseta todo o estado (usado ao começar e ao refazer o quiz) ----------
  // Nunca mexe em localStorage.quizLeads/quizAnalytics — histórico de leads e
  // analytics é preservado sempre, mesmo quando o usuário refaz o quiz várias vezes.
  function resetarEstadoCompleto() {
    faseAtual = 'propostas';
    indicePropostas = 0;
    indicePerfil = 0;
    respostasPropostas = new Array(QUESTIONS.length).fill(null);
    respostasPerfilIndices = new Array(PROFILE_QUESTIONS.length).fill(null);
    nomeUsuario = '';
    resultadoFinal = null;
    bloqueadoAvanco = false;
    enviandoLead = false;
    formNome.reset();
    formLead.reset();
    erroNomeUsuario.textContent = '';
    erroWhatsapp.textContent = '';
    erroEmail.textContent = '';
  }

  // ======================================================================
  // FASE 1: PROPOSTAS (contribuem para a pontuação/match)
  // ======================================================================

  function iniciarPropostas() {
    faseAtual = 'propostas';
    indicePropostas = 0;
    mostrarTela(telaPerguntas);
    renderizarPropostaAtual();
  }

  function renderizarPropostaAtual() {
    const proposta = QUESTIONS[indicePropostas];
    const total = QUESTIONS.length;

    const progresso = ((indicePropostas + 1) / total) * 100;
    barraProgresso.style.width = `${progresso}%`;
    barraProgresso.parentElement.setAttribute('aria-valuemax', String(total));
    barraProgresso.parentElement.setAttribute('aria-valuenow', String(indicePropostas + 1));
    contadorPerguntas.textContent = `PROPOSTA ${indicePropostas + 1} DE ${total}`;

    const infoCategoria = CATEGORIA_INFO[proposta.categoria];
    categoriaChip.hidden = false;
    categoriaChip.textContent = infoCategoria
      ? `${infoCategoria.emoji} ${infoCategoria.nome.toUpperCase()}`
      : '';

    textoPergunta.textContent = proposta.texto;

    areaResposta.innerHTML = '';
    areaResposta.className = 'area-resposta area-resposta--propostas';

    const opcoesResposta = [
      { chave: 'sim', rotulo: '❤️ SIM' },
      { chave: 'nao', rotulo: '❌ NÃO' },
      { chave: 'pular', rotulo: '➡️ PULAR' },
    ];

    opcoesResposta.forEach((opcao) => {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = `btn-proposta btn-proposta--${opcao.chave}`;
      botao.dataset.resposta = opcao.chave;
      botao.textContent = opcao.rotulo;
      botao.setAttribute('aria-pressed', 'false');

      if (respostasPropostas[indicePropostas] === opcao.chave) {
        botao.classList.add('btn-proposta--selecionado');
        botao.setAttribute('aria-pressed', 'true');
      }

      botao.addEventListener('click', () => selecionarProposta(opcao.chave));
      areaResposta.appendChild(botao);
    });

    btnVoltar.hidden = indicePropostas === 0;
    reiniciarAnimacaoPergunta();
    textoPergunta.focus();
  }

  function selecionarProposta(resposta) {
    if (bloqueadoAvanco) return; // ignora cliques múltiplos durante a transição
    bloqueadoAvanco = true;

    respostasPropostas[indicePropostas] = resposta;
    destacarRespostaProposta(resposta);

    const atraso = prefereReduzirMovimento ? 50 : 320;
    setTimeout(() => {
      bloqueadoAvanco = false;
      avancarProposta();
    }, atraso);
  }

  function destacarRespostaProposta(resposta) {
    const botoes = areaResposta.querySelectorAll('.btn-proposta');
    botoes.forEach((botao) => {
      const ativo = botao.dataset.resposta === resposta;
      botao.classList.toggle('btn-proposta--selecionado', ativo);
      botao.setAttribute('aria-pressed', String(ativo));
      // Microinteração: pulso pro SIM, "saída" pro NÃO, neutro pro PULAR
      if (ativo && !prefereReduzirMovimento) {
        botao.classList.add(`anim-${resposta}`);
      }
    });
  }

  function avancarProposta() {
    if (indicePropostas + 1 < QUESTIONS.length) {
      indicePropostas += 1;
      renderizarPropostaAtual();
    } else {
      // Fim das propostas: mostra a transição antes das perguntas de perfil
      mostrarTela(telaPerfilTransicao);
    }
  }

  function voltarProposta() {
    if (indicePropostas === 0) return;
    indicePropostas -= 1;
    renderizarPropostaAtual();
  }

  // ======================================================================
  // FASE 2: PERFIL (NUNCA entra no cálculo do match — só analytics/lead)
  // ======================================================================

  function iniciarPerfil() {
    faseAtual = 'perfil';
    indicePerfil = 0;
    mostrarTela(telaPerguntas);
    renderizarPerfilAtual();
  }

  function renderizarPerfilAtual() {
    const pergunta = PROFILE_QUESTIONS[indicePerfil];
    const total = PROFILE_QUESTIONS.length;

    const progresso = ((indicePerfil + 1) / total) * 100;
    barraProgresso.style.width = `${progresso}%`;
    barraProgresso.parentElement.setAttribute('aria-valuemax', String(total));
    barraProgresso.parentElement.setAttribute('aria-valuenow', String(indicePerfil + 1));
    contadorPerguntas.textContent = `PERGUNTA ${indicePerfil + 1} DE ${total}`;

    categoriaChip.hidden = true;
    textoPergunta.textContent = pergunta.pergunta;

    areaResposta.innerHTML = '';
    areaResposta.className = 'area-resposta area-resposta--perfil';

    pergunta.opcoes.forEach((opcao, indiceOpcao) => {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'opcao';
      botao.textContent = opcao.texto;
      botao.setAttribute('aria-pressed', 'false');

      if (respostasPerfilIndices[indicePerfil] === indiceOpcao) {
        botao.classList.add('opcao-selecionada');
        botao.setAttribute('aria-pressed', 'true');
      }

      botao.addEventListener('click', () => selecionarPerfil(indiceOpcao));
      areaResposta.appendChild(botao);
    });

    // Escopo do botão voltar: só dentro da fase atual (perfil não volta pra propostas)
    btnVoltar.hidden = indicePerfil === 0;
    reiniciarAnimacaoPergunta();
    textoPergunta.focus();
  }

  function selecionarPerfil(indiceOpcao) {
    if (bloqueadoAvanco) return;
    bloqueadoAvanco = true;

    respostasPerfilIndices[indicePerfil] = indiceOpcao;
    const botoes = areaResposta.querySelectorAll('.opcao');
    botoes.forEach((botao, i) => {
      const selecionado = i === indiceOpcao;
      botao.classList.toggle('opcao-selecionada', selecionado);
      botao.setAttribute('aria-pressed', String(selecionado));
    });

    const atraso = prefereReduzirMovimento ? 50 : 320;
    setTimeout(() => {
      bloqueadoAvanco = false;
      avancarPerfil();
    }, atraso);
  }

  function avancarPerfil() {
    if (indicePerfil + 1 < PROFILE_QUESTIONS.length) {
      indicePerfil += 1;
      renderizarPerfilAtual();
    } else {
      finalizarPerfil();
    }
  }

  function voltarPerfil() {
    if (indicePerfil === 0) return;
    indicePerfil -= 1;
    renderizarPerfilAtual();
  }

  // Botão "Voltar" é compartilhado pelas duas fases da tela de perguntas
  btnVoltar.addEventListener('click', () => {
    if (faseAtual === 'propostas') {
      voltarProposta();
    } else {
      voltarPerfil();
    }
  });

  function reiniciarAnimacaoPergunta() {
    if (prefereReduzirMovimento) return;
    conteudoPergunta.classList.remove('anim-pergunta');
    void conteudoPergunta.offsetWidth; // força reflow pra reiniciar a animação
    conteudoPergunta.classList.add('anim-pergunta');
  }

  // ---------- Fim do perfil: calcula o match (só com base nas propostas) e pede o nome ----------
  function finalizarPerfil() {
    resultadoFinal = calcularResultado();
    erroNomeUsuario.textContent = '';
    formNome.reset();
    mostrarTela(telaNome);
    inputNomeUsuario.focus();
  }

  // ======================================================================
  // PONTUAÇÃO / MATCH — sempre recalculada do zero a partir de respostasPropostas,
  // evitando bugs de "subtrair pontos antigos" quando o usuário volta e troca resposta.
  // ======================================================================

  function calcularPontuacoes() {
    const pontuacoes = {};
    ARCHETYPES.forEach((arquetipo) => {
      pontuacoes[arquetipo.codigo] = 0;
    });

    respostasPropostas.forEach((resposta, indice) => {
      if (resposta !== 'sim' && resposta !== 'nao') return; // ignora "pular" e não respondidas
      const pesos = QUESTIONS[indice][resposta];
      if (!pesos) return;
      Object.entries(pesos).forEach(([codigo, pontos]) => {
        pontuacoes[codigo] += pontos;
      });
    });

    return pontuacoes;
  }

  // Pontuação máxima que cada arquétipo poderia atingir (melhor escolha possível em
  // cada proposta) — usada como base da % de compatibilidade. Calculada a partir dos
  // dados reais, nunca hardcoded, então continua correta se as propostas mudarem.
  function calcularMaxPossivel() {
    const maximo = {};
    ARCHETYPES.forEach((arquetipo) => {
      maximo[arquetipo.codigo] = 0;
    });

    QUESTIONS.forEach((proposta) => {
      ARCHETYPES.forEach((arquetipo) => {
        const simPontos = (proposta.sim && proposta.sim[arquetipo.codigo]) || 0;
        const naoPontos = (proposta.nao && proposta.nao[arquetipo.codigo]) || 0;
        maximo[arquetipo.codigo] += Math.max(simPontos, naoPontos, 0);
      });
    });

    return maximo;
  }

  function calcularResultado() {
    const pontuacoes = calcularPontuacoes();
    const maxPossivel = calcularMaxPossivel();
    const valores = Object.values(pontuacoes);
    const maiorPontuacao = Math.max(...valores);

    // Empate: monta array com todos os empatados e sorteia um, sem favorecer nenhum
    const empatados = Object.keys(pontuacoes).filter(
      (codigo) => pontuacoes[codigo] === maiorPontuacao
    );
    const codigoVencedor = empatados[Math.floor(Math.random() * empatados.length)];
    const arquetipo = ARCHETYPES.find((a) => a.codigo === codigoVencedor);

    const maximo = maxPossivel[codigoVencedor] || 0;
    let compatibilidade = maximo === 0 ? 0 : Math.round((pontuacoes[codigoVencedor] / maximo) * 100);
    compatibilidade = Math.max(0, Math.min(100, compatibilidade)); // limita entre 0% e 100%

    return { arquetipo, compatibilidade };
  }

  // "SEU PERFIL": % de propostas respondidas com SIM em cada categoria (ignora "pular").
  // Categoria sem nenhuma resposta (tudo pulado) não aparece, em vez de mostrar 0% enganoso.
  function calcularCategorias() {
    const acumulado = {};

    QUESTIONS.forEach((proposta, indice) => {
      const resposta = respostasPropostas[indice];
      if (resposta !== 'sim' && resposta !== 'nao') return;
      if (!acumulado[proposta.categoria]) acumulado[proposta.categoria] = { sim: 0, nao: 0 };
      acumulado[proposta.categoria][resposta] += 1;
    });

    return Object.keys(CATEGORIA_INFO)
      .map((chave) => {
        const dados = acumulado[chave];
        if (!dados) return null;
        const total = dados.sim + dados.nao;
        const percentual = total === 0 ? 0 : Math.round((dados.sim / total) * 100);
        return { chave, emoji: CATEGORIA_INFO[chave].emoji, nome: CATEGORIA_INFO[chave].nome, percentual };
      })
      .filter(Boolean);
  }

  // "POR QUE DEU MATCH?": propostas em que a resposta do usuário deu pontos pro
  // arquétipo vencedor, ordenadas pela contribuição. Se o usuário pulou proposta
  // demais e nada sobrou, cai no fallback das características fixas do arquétipo.
  function calcularMotivos(codigoVencedor) {
    const candidatos = [];

    respostasPropostas.forEach((resposta, indice) => {
      if (resposta !== 'sim' && resposta !== 'nao') return;
      const proposta = QUESTIONS[indice];
      const pontos = (proposta[resposta] && proposta[resposta][codigoVencedor]) || 0;
      if (pontos > 0) {
        const infoCategoria = CATEGORIA_INFO[proposta.categoria];
        candidatos.push({
          texto: `${infoCategoria ? infoCategoria.emoji : ''} ${proposta.rotulo}`.trim(),
          pontos,
        });
      }
    });

    candidatos.sort((a, b) => b.pontos - a.pontos);
    return candidatos.slice(0, 3).map((c) => c.texto);
  }

  // ---------- Leitura das respostas de perfil (valor = slug pra analytics, texto = label pro lead) ----------
  function obterValorPerfil(chave) {
    const indicePergunta = PROFILE_QUESTIONS.findIndex((p) => p.chave === chave);
    if (indicePergunta === -1) return null;
    const indiceOpcao = respostasPerfilIndices[indicePergunta];
    if (indiceOpcao === null || indiceOpcao === undefined) return null;
    return PROFILE_QUESTIONS[indicePergunta].opcoes[indiceOpcao].valor;
  }

  function obterTextoPerfil(chave) {
    const indicePergunta = PROFILE_QUESTIONS.findIndex((p) => p.chave === chave);
    if (indicePergunta === -1) return null;
    const indiceOpcao = respostasPerfilIndices[indicePergunta];
    if (indiceOpcao === null || indiceOpcao === undefined) return null;
    return PROFILE_QUESTIONS[indicePergunta].opcoes[indiceOpcao].texto;
  }

  // ======================================================================
  // TELA DE NOME
  // ======================================================================
  formNome.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nome = inputNomeUsuario.value.trim();
    erroNomeUsuario.textContent = '';

    if (nome.length < 2) {
      erroNomeUsuario.textContent = 'Digite seu nome (mínimo 2 caracteres).';
      return;
    }

    nomeUsuario = nome;
    mostrarTela(telaLead);
  });

  // ======================================================================
  // TELA DE LEAD (WhatsApp + e-mail opcional — nome já foi capturado antes)
  // ======================================================================
  function formatarWhatsapp(valor) {
    const digitos = valor.replace(/\D/g, '').slice(0, 11);
    if (digitos.length === 0) return '';
    if (digitos.length <= 2) return digitos.replace(/(\d{0,2})/, '($1');
    if (digitos.length <= 6) return digitos.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    if (digitos.length <= 10) return digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  inputWhatsapp.addEventListener('input', (evento) => {
    evento.target.value = formatarWhatsapp(evento.target.value);
    erroWhatsapp.textContent = '';
  });
  inputEmail.addEventListener('input', () => {
    erroEmail.textContent = '';
  });

  function validarLead() {
    let valido = true;
    erroWhatsapp.textContent = '';
    erroEmail.textContent = '';

    const digitosWhatsapp = inputWhatsapp.value.replace(/\D/g, '');
    const email = inputEmail.value.trim();

    // Aceita formatos brasileiros comuns: DDD + 8 ou 9 dígitos (com ou sem 9º dígito)
    if (digitosWhatsapp.length < 10 || digitosWhatsapp.length > 11) {
      erroWhatsapp.textContent = 'Digite um WhatsApp válido com DDD.';
      valido = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      erroEmail.textContent = 'Digite um e-mail válido ou deixe em branco.';
      valido = false;
    }

    return valido;
  }

  formLead.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (enviandoLead) return; // evita duplo envio por clique múltiplo
    if (!validarLead()) return;

    enviandoLead = true;
    btnEnviarLead.disabled = true;
    const textoOriginalBotao = btnEnviarLead.textContent;
    btnEnviarLead.textContent = 'Enviando...';

    const dadosLead = {
      nome: nomeUsuario,
      whatsapp: inputWhatsapp.value.trim(),
      email: inputEmail.value.trim(),
      resultado: resultadoFinal.arquetipo.codigo,
      compatibilidade: resultadoFinal.compatibilidade,
      // Dados de perfil separados dos dados usados pro match — só enriquecem o lead
      ondeMora: obterTextoPerfil('localizacaoTipo'),
      situacaoTrabalho: obterTextoPerfil('situacao'),
      faixaEtaria: obterTextoPerfil('faixaEtaria'),
      plataforma: obterTextoPerfil('plataforma'),
      timestamp: new Date().toISOString(),
    };

    try {
      await submitLead(dadosLead);
    } catch (erro) {
      console.error('Erro ao enviar lead:', erro);
      // Mesmo com erro no envio, não trava o usuário — ele já vê o resultado a seguir
    } finally {
      enviandoLead = false;
      btnEnviarLead.disabled = false;
      btnEnviarLead.textContent = textoOriginalBotao;
    }

    irParaAnalisando();
  });

  linkPular.addEventListener('click', (evento) => {
    evento.preventDefault();
    irParaAnalisando();
  });

  // ======================================================================
  // TELA DE ANÁLISE (suspense curto, personalizado, ~1-1.5s)
  // ======================================================================
  function irParaAnalisando() {
    mostrarTela(telaAnalisando);
    textoAnalisando.textContent = 'Analisando suas escolhas...';

    const atraso1 = prefereReduzirMovimento ? 120 : 700;
    const atraso2 = prefereReduzirMovimento ? 120 : 700;

    setTimeout(() => {
      textoAnalisando.textContent = `${nomeUsuario}, encontramos seu match! 👀`;
      setTimeout(revelarResultado, atraso2);
    }, atraso1);
  }

  // ======================================================================
  // ANALYTICS ANÔNIMO — nunca junto de nome/whatsapp/email
  // ======================================================================
  function salvarAnalytics() {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage indisponível — analytics não pôde ser salvo.');
      return;
    }

    let analytics = [];
    try {
      const armazenado = localStorage.getItem('quizAnalytics');
      analytics = armazenado ? JSON.parse(armazenado) : [];
      if (!Array.isArray(analytics)) analytics = [];
    } catch (erro) {
      console.error('quizAnalytics continha JSON inválido, reiniciando lista:', erro);
      analytics = [];
    }

    const respostasPropostasAnalytics = QUESTIONS.map((proposta, indice) => ({
      propostaId: proposta.id,
      resposta: respostasPropostas[indice] || 'pular',
    }));

    analytics.push({
      timestamp: new Date().toISOString(),
      respostasPropostas: respostasPropostasAnalytics,
      resultado: resultadoFinal.arquetipo.codigo,
      compatibilidade: resultadoFinal.compatibilidade,
      perfil: {
        faixaEtaria: obterValorPerfil('faixaEtaria'),
        situacao: obterValorPerfil('situacao'),
        ambiente: obterValorPerfil('localizacaoTipo'),
        plataforma: obterValorPerfil('plataforma'),
      },
    });

    try {
      localStorage.setItem('quizAnalytics', JSON.stringify(analytics));
    } catch (erro) {
      console.error('Erro ao salvar analytics no localStorage:', erro);
    }
  }

  // ======================================================================
  // RESULTADO
  // ======================================================================
  function revelarResultado() {
    salvarAnalytics();
    renderizarResultado();
    mostrarTela(telaResultado);
  }

  function renderizarResultado() {
    const { arquetipo, compatibilidade } = resultadoFinal;

    // Evita afirmar "você é X" — deixa claro que é compatibilidade baseada nas escolhas
    introResultado.textContent = `${nomeUsuario}, suas escolhas deram maior compatibilidade com:`;
    resultadoEmoji.textContent = arquetipo.emoji;
    resultadoNomePresidente.textContent = arquetipo.nomePresidente;
    resultadoNomePerfil.textContent = arquetipo.nomePerfil;
    resultadoCompatibilidade.textContent = `${compatibilidade}% DE COMPATIBILIDADE`;
    resultadoTagline.textContent = `"${arquetipo.tagline}"`;

    cardResultado.style.setProperty('--cor-primaria', arquetipo.corPrimaria);
    cardResultado.style.setProperty('--cor-secundaria', arquetipo.corSecundaria);

    renderizarCategorias();
    renderizarMotivos(arquetipo);
  }

  function renderizarCategorias() {
    listaCategorias.innerHTML = '';
    const categorias = calcularCategorias();

    if (categorias.length === 0) {
      const aviso = document.createElement('p');
      aviso.className = 'texto-compatibilidade';
      aviso.textContent = 'Você pulou propostas demais pra gente calcular seu perfil por categoria 😅';
      listaCategorias.appendChild(aviso);
      return;
    }

    categorias.forEach((categoria) => {
      const item = document.createElement('div');
      item.className = 'categoria-item';

      const cabecalho = document.createElement('div');
      cabecalho.className = 'categoria-cabecalho';
      const rotulo = document.createElement('span');
      rotulo.textContent = `${categoria.emoji} ${categoria.nome}`;
      const percentual = document.createElement('span');
      percentual.textContent = `${categoria.percentual}%`;
      cabecalho.appendChild(rotulo);
      cabecalho.appendChild(percentual);

      const fundo = document.createElement('div');
      fundo.className = 'categoria-barra-fundo';
      const preenchida = document.createElement('div');
      preenchida.className = 'categoria-barra-preenchida';
      preenchida.style.width = `${categoria.percentual}%`;
      fundo.appendChild(preenchida);

      item.appendChild(cabecalho);
      item.appendChild(fundo);
      listaCategorias.appendChild(item);
    });
  }

  function renderizarMotivos(arquetipo) {
    listaMotivos.innerHTML = '';
    const motivosDinamicos = calcularMotivos(arquetipo.codigo);
    const motivos = motivosDinamicos.length > 0 ? motivosDinamicos : arquetipo.caracteristicas;

    motivos.forEach((motivo) => {
      const item = document.createElement('li');
      item.textContent = motivo;
      listaMotivos.appendChild(item);
    });
  }

  // ---------- Compartilhamento ----------
  btnCompartilhar.addEventListener('click', async () => {
    const texto = 'Eu descobri com qual Presidente Ideal eu dei match 👀. Qual seria o seu?';
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Qual é o seu Presidente Ideal?', text: texto, url });
      } catch (erro) {
        // Usuário cancelou o compartilhamento ou o navegador bloqueou — não é um erro real
      }
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        mostrarFeedbackCompartilhar('Link copiado! 🔥');
      } catch (erro) {
        mostrarFeedbackCompartilhar('Não foi possível copiar o link automaticamente.');
      }
    } else {
      mostrarFeedbackCompartilhar('Copie o link da página pra compartilhar.');
    }
  });

  function mostrarFeedbackCompartilhar(mensagem) {
    feedbackCompartilhar.textContent = mensagem;
    setTimeout(() => {
      feedbackCompartilhar.textContent = '';
    }, 3000);
  }

  // ---------- Refazer o quiz: limpa o estado, NUNCA mexe em leads/analytics salvos ----------
  btnRefazer.addEventListener('click', () => {
    resetarEstadoCompleto();
    mostrarTela(telaInicio);
  });

  // ---------- Listeners de navegação principal entre telas fixas ----------
  document.getElementById('btn-comecar').addEventListener('click', () => {
    resetarEstadoCompleto();
    mostrarTela(telaExplicacao);
  });
  document.getElementById('btn-continuar-explicacao').addEventListener('click', iniciarPropostas);
  document.getElementById('btn-continuar-perfil').addEventListener('click', iniciarPerfil);
})();
