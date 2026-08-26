// script.js
// Estado da aplicação, navegação entre telas, pontuação, analytics e compartilhamento.
// Depende de ARCHETYPES (archetypes.js), QUESTIONS (questions.js) e submitLead (lead-handler.js).
// Tudo dentro de uma IIFE pra não vazar variáveis desnecessárias no escopo global.

(function () {
  'use strict';

  // ---------- Preferência de movimento reduzido (acessibilidade) ----------
  const prefereReduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Estado do quiz ----------
  let indiceAtual = 0; // índice da pergunta atual
  let respostasEscolhidas = new Array(QUESTIONS.length).fill(null); // índice da opção escolhida por pergunta
  let resultadoFinal = null; // { arquetipo, compatibilidade }, calculado uma única vez ao fim da Q8
  let bloqueadoAvanco = false; // evita cliques múltiplos disparando avanços duplicados
  let enviandoLead = false; // evita duplo envio do formulário de lead

  // ---------- Elementos das telas ----------
  const telaInicio = document.getElementById('tela-inicio');
  const telaPerguntas = document.getElementById('tela-perguntas');
  const telaLead = document.getElementById('tela-lead');
  const telaResultado = document.getElementById('tela-resultado');
  const telas = [telaInicio, telaPerguntas, telaLead, telaResultado];

  // ---------- Elementos da tela de perguntas ----------
  const btnVoltar = document.getElementById('btn-voltar');
  const barraProgresso = document.getElementById('barra-progresso');
  const conteudoPergunta = document.getElementById('conteudo-pergunta');
  const contadorPerguntas = document.getElementById('contador-perguntas');
  const textoPergunta = document.getElementById('texto-pergunta');
  const listaOpcoes = document.getElementById('lista-opcoes');

  // ---------- Elementos da tela de lead ----------
  const formLead = document.getElementById('form-lead');
  const inputNome = document.getElementById('input-nome');
  const inputWhatsapp = document.getElementById('input-whatsapp');
  const inputEmail = document.getElementById('input-email');
  const erroNome = document.getElementById('erro-nome');
  const erroWhatsapp = document.getElementById('erro-whatsapp');
  const erroEmail = document.getElementById('erro-email');
  const btnEnviarLead = document.getElementById('btn-enviar-lead');
  const linkPular = document.getElementById('link-pular');

  // ---------- Elementos da tela de resultado ----------
  const cardResultado = document.getElementById('card-resultado');
  const resultadoEmoji = document.getElementById('resultado-emoji');
  const resultadoNome = document.getElementById('resultado-nome');
  const resultadoTagline = document.getElementById('resultado-tagline');
  const resultadoDescricao = document.getElementById('resultado-descricao');
  const barraCompatibilidade = document.getElementById('barra-compatibilidade');
  const textoCompatibilidade = document.getElementById('texto-compatibilidade');
  const listaCaracteristicas = document.getElementById('lista-caracteristicas');
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

  // ---------- Início do quiz ----------
  function iniciarQuiz() {
    indiceAtual = 0;
    respostasEscolhidas = new Array(QUESTIONS.length).fill(null);
    resultadoFinal = null;
    bloqueadoAvanco = false;
    // Mostra a tela antes de renderizar a pergunta: garante que o .focus() no
    // título funcione já na primeira pergunta (elemento display:none não recebe foco)
    mostrarTela(telaPerguntas);
    renderizarPergunta(0);
  }

  // ---------- Renderiza a pergunta do índice informado ----------
  function renderizarPergunta(indice) {
    const pergunta = QUESTIONS[indice];

    const progresso = ((indice + 1) / QUESTIONS.length) * 100;
    barraProgresso.style.width = `${progresso}%`;
    barraProgresso.parentElement.setAttribute('aria-valuenow', String(indice + 1));
    contadorPerguntas.textContent = `PERGUNTA ${indice + 1} DE ${QUESTIONS.length}`;

    textoPergunta.textContent = pergunta.pergunta;

    listaOpcoes.innerHTML = '';
    listaOpcoes.setAttribute('aria-label', pergunta.pergunta);

    pergunta.opcoes.forEach((opcao, indiceOpcao) => {
      const botaoOpcao = document.createElement('button');
      botaoOpcao.type = 'button';
      botaoOpcao.className = 'opcao';
      botaoOpcao.textContent = opcao.texto;
      botaoOpcao.setAttribute('aria-pressed', 'false');

      // Se o usuário já respondeu essa pergunta (voltou depois), restaura o destaque
      if (respostasEscolhidas[indice] === indiceOpcao) {
        botaoOpcao.classList.add('opcao-selecionada');
        botaoOpcao.setAttribute('aria-pressed', 'true');
      }

      botaoOpcao.addEventListener('click', () => selecionarOpcao(indiceOpcao));
      listaOpcoes.appendChild(botaoOpcao);
    });

    btnVoltar.hidden = indice === 0;

    // Reinicia a animação de fade + slide horizontal, respeitando prefers-reduced-motion
    if (!prefereReduzirMovimento) {
      conteudoPergunta.classList.remove('anim-pergunta');
      void conteudoPergunta.offsetWidth; // força reflow pra reiniciar a animação
      conteudoPergunta.classList.add('anim-pergunta');
    }

    // Move o foco pro título da pergunta (útil pra leitor de tela e navegação por teclado)
    textoPergunta.focus();
  }

  // ---------- Seleciona uma opção, recalcula nada na hora (só guarda o índice) e avança ----------
  function selecionarOpcao(indiceOpcao) {
    if (bloqueadoAvanco) return; // ignora cliques múltiplos durante a transição
    bloqueadoAvanco = true;

    respostasEscolhidas[indiceAtual] = indiceOpcao;
    destacarOpcaoSelecionada(indiceOpcao);

    const atraso = prefereReduzirMovimento ? 50 : 320;
    setTimeout(() => {
      bloqueadoAvanco = false;
      avancarPergunta();
    }, atraso);
  }

  function destacarOpcaoSelecionada(indiceOpcao) {
    const botoes = listaOpcoes.querySelectorAll('.opcao');
    botoes.forEach((botao, i) => {
      const selecionado = i === indiceOpcao;
      botao.classList.toggle('opcao-selecionada', selecionado);
      botao.setAttribute('aria-pressed', String(selecionado));
    });
  }

  function avancarPergunta() {
    if (indiceAtual + 1 < QUESTIONS.length) {
      indiceAtual += 1;
      renderizarPergunta(indiceAtual);
    } else {
      finalizarPerguntas();
    }
  }

  function voltarPergunta() {
    if (indiceAtual === 0) return;
    indiceAtual -= 1;
    renderizarPergunta(indiceAtual);
  }

  // ---------- Pontuação (sempre recalculada do zero a partir de respostasEscolhidas) ----------
  // Recalcular do zero evita bugs de "subtrair pontos antigos" quando o usuário volta e troca resposta.
  function calcularPontuacoes() {
    const pontuacoes = {};
    ARCHETYPES.forEach((arquetipo) => {
      pontuacoes[arquetipo.codigo] = 0;
    });

    respostasEscolhidas.forEach((indiceOpcao, indicePergunta) => {
      if (indiceOpcao === null || indiceOpcao === undefined) return;
      const opcao = QUESTIONS[indicePergunta].opcoes[indiceOpcao];
      Object.entries(opcao.pontos).forEach(([codigo, pontos]) => {
        pontuacoes[codigo] += pontos;
      });
    });

    return pontuacoes;
  }

  // ---------- Calcula o arquétipo vencedor + % de compatibilidade ----------
  function calcularResultado() {
    const pontuacoes = calcularPontuacoes();
    const valores = Object.values(pontuacoes);
    const maiorPontuacao = Math.max(...valores);

    // Empate: monta array com todos os empatados e sorteia um, sem favorecer nenhum
    const empatados = Object.keys(pontuacoes).filter(
      (codigo) => pontuacoes[codigo] === maiorPontuacao
    );
    const codigoVencedor = empatados[Math.floor(Math.random() * empatados.length)];
    const arquetipo = ARCHETYPES.find((a) => a.codigo === codigoVencedor);

    const somaTotal = valores.reduce((acumulado, valor) => acumulado + valor, 0);
    const compatibilidade =
      somaTotal === 0 ? 0 : Math.round((pontuacoes[codigoVencedor] / somaTotal) * 100);

    return { arquetipo, compatibilidade };
  }

  // ---------- Fim das 8 perguntas: calcula o resultado uma única vez e vai pra captura de lead ----------
  function finalizarPerguntas() {
    resultadoFinal = calcularResultado();
    limparErrosLead();
    formLead.reset();
    mostrarTela(telaLead);
    inputNome.focus();
  }

  // ---------- Máscara visual simples de WhatsApp brasileiro: (XX) XXXXX-XXXX ----------
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
  inputNome.addEventListener('input', () => {
    erroNome.textContent = '';
  });
  inputEmail.addEventListener('input', () => {
    erroEmail.textContent = '';
  });

  function limparErrosLead() {
    erroNome.textContent = '';
    erroWhatsapp.textContent = '';
    erroEmail.textContent = '';
  }

  // ---------- Validação do formulário de lead ----------
  function validarLead() {
    let valido = true;
    limparErrosLead();

    const nome = inputNome.value.trim();
    const digitosWhatsapp = inputWhatsapp.value.replace(/\D/g, '');
    const email = inputEmail.value.trim();

    if (nome.length < 2) {
      erroNome.textContent = 'Digite seu nome (mínimo 2 caracteres).';
      valido = false;
    }

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

  // ---------- Envio do formulário de lead ----------
  formLead.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (enviandoLead) return; // evita duplo envio por clique múltiplo
    if (!validarLead()) return;

    enviandoLead = true;
    btnEnviarLead.disabled = true;
    const textoOriginalBotao = btnEnviarLead.textContent;
    btnEnviarLead.textContent = 'Enviando...';

    const dadosLead = {
      nome: inputNome.value.trim(),
      whatsapp: inputWhatsapp.value.trim(),
      email: inputEmail.value.trim(),
      resultado: resultadoFinal.arquetipo.codigo,
      // Texto completo das respostas de Q1 e Q2 — são os dados de qualificação de
      // lead que mais interessam pro negócio (onde mora / situação de trabalho).
      ondeMora: QUESTIONS[0].opcoes[respostasEscolhidas[0]].texto,
      situacaoTrabalho: QUESTIONS[1].opcoes[respostasEscolhidas[1]].texto,
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

    revelarResultado();
  });

  // ---------- Pular a captura de lead ----------
  linkPular.addEventListener('click', (evento) => {
    evento.preventDefault();
    revelarResultado();
  });

  // ---------- Analytics anônimo (nunca junto de nome/whatsapp/email) ----------
  function salvarAnalytics(codigoResultado) {
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

    analytics.push({
      timestamp: new Date().toISOString(),
      respostas: respostasEscolhidas.slice(), // só índices das alternativas — nenhum dado pessoal
      resultado: codigoResultado,
    });

    try {
      localStorage.setItem('quizAnalytics', JSON.stringify(analytics));
    } catch (erro) {
      console.error('Erro ao salvar analytics no localStorage:', erro);
    }
  }

  // ---------- Revela o resultado (chamado após lead capturado ou pulado) ----------
  function revelarResultado() {
    salvarAnalytics(resultadoFinal.arquetipo.codigo);
    renderizarResultado();
    mostrarTela(telaResultado);
  }

  function renderizarResultado() {
    const { arquetipo, compatibilidade } = resultadoFinal;

    resultadoEmoji.textContent = arquetipo.emoji;
    resultadoNome.textContent = arquetipo.nome;
    resultadoTagline.textContent = `"${arquetipo.tagline}"`;
    resultadoDescricao.textContent = arquetipo.descricao;

    cardResultado.style.setProperty('--cor-primaria', arquetipo.corPrimaria);
    cardResultado.style.setProperty('--cor-secundaria', arquetipo.corSecundaria);

    barraCompatibilidade.style.width = `${compatibilidade}%`;
    barraCompatibilidade.parentElement.setAttribute('aria-valuenow', String(compatibilidade));
    textoCompatibilidade.textContent = `${compatibilidade}% de compatibilidade com esse arquétipo`;

    listaCaracteristicas.innerHTML = '';
    arquetipo.caracteristicas.forEach((caracteristica) => {
      const item = document.createElement('li');
      item.textContent = caracteristica;
      listaCaracteristicas.appendChild(item);
    });
  }

  // ---------- Compartilhamento ----------
  btnCompartilhar.addEventListener('click', async () => {
    const texto = 'Eu descobri qual é o meu arquétipo no quiz. Qual seria o seu?';
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
        mostrarFeedbackCompartilhar('Link copiado!');
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

  // ---------- Refazer o quiz: limpa todo o estado anterior ----------
  function refazerQuiz() {
    indiceAtual = 0;
    respostasEscolhidas = new Array(QUESTIONS.length).fill(null);
    resultadoFinal = null;
    bloqueadoAvanco = false;
    limparErrosLead();
    formLead.reset();
    mostrarTela(telaInicio);
  }

  // ---------- Listeners de navegação principal ----------
  document.getElementById('btn-comecar').addEventListener('click', iniciarQuiz);
  btnVoltar.addEventListener('click', voltarPergunta);
  btnRefazer.addEventListener('click', refazerQuiz);
})();
