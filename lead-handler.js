// lead-handler.js
// Somente lógica de armazenamento/envio de leads. Isolado pra facilitar plugar
// um endpoint real depois (Google Apps Script, Zapier, CRM etc.) sem tocar em script.js.
// Não inventa webhook nem URL de API — isso fica a cargo do dono do projeto.
//
// Integração com Supabase: veja supabase-schema.sql pra criar a tabela "leads" e a
// policy de segurança (insert-only pro papel anônimo). Depois de rodar o SQL, troque
// as duas constantes abaixo pela Project URL e a anon/public key reais (Settings → API
// no painel do Supabase). Enquanto estiverem com o valor de exemplo, a integração fica
// desativada e o app continua funcionando só com o fallback em localStorage.

(function () {
  'use strict';

  // TODO: substituir pelas credenciais reais do seu projeto Supabase
  const SUPABASE_URL = 'https://dpqqlkoinqcbazwwrhew.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcXFsa29pbnFjYmF6d3dyaGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODY1ODcsImV4cCI6MjEwMzI2MjU4N30.CDbx9uaqWnxry5nTox8ywzg9V21lLnfoKvZrHq8_tNE';

  const supabaseConfigurado =
    SUPABASE_URL.indexOf('SEU-PROJETO') === -1 && SUPABASE_ANON_KEY.indexOf('SUA-ANON-KEY') === -1;

  // O cliente só é criado se as credenciais foram preenchidas E o script da Supabase
  // (carregado via CDN no index.html) existir — evita erro caso o CDN não carregue.
  let supabaseClient = null;
  if (supabaseConfigurado && typeof supabase !== 'undefined') {
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (erro) {
      console.error('Erro ao inicializar o cliente do Supabase:', erro);
    }
  }

  /**
   * Recebe o lead capturado no quiz e cuida do envio/armazenamento.
   * @param {{nome: string, whatsapp: string, email: string, resultado: string, ondeMora: string, situacaoTrabalho: string, timestamp: string}} data
   * @returns {Promise<boolean>} sucesso do processamento local (sempre true, mesmo sem endpoint remoto ainda)
   */
  async function submitLead(data) {
    try {
      salvarLeadLocal(data);
    } catch (erro) {
      // Erro inesperado (ex: quota do localStorage estourada) — não deve travar o fluxo do quiz
      console.error('Erro inesperado ao processar lead:', erro);
    }

    if (supabaseClient) {
      try {
        await enviarLeadParaSupabase(data);
      } catch (erro) {
        // Falha de rede/Supabase não deve travar o quiz — o lead já está salvo localmente
        console.error('Erro ao enviar lead pro Supabase:', erro);
      }
    }

    // TODO: plugar outro endpoint real aqui, se quiser (Google Apps Script, Zapier, CRM etc.)

    return true;
  }

  /**
   * Insere o lead na tabela "leads" do Supabase (ver supabase-schema.sql).
   * @param {{nome: string, whatsapp: string, email: string, resultado: string, ondeMora: string, situacaoTrabalho: string}} data
   */
  async function enviarLeadParaSupabase(data) {
    const { error } = await supabaseClient.from('leads').insert([
      {
        nome: data.nome,
        whatsapp: data.whatsapp,
        email: data.email || null,
        resultado: data.resultado,
        onde_mora: data.ondeMora || null,
        situacao_trabalho: data.situacaoTrabalho || null,
      },
    ]);

    if (error) {
      console.error('Supabase recusou o insert do lead:', error);
    }
  }

  /**
   * Guarda o lead em localStorage.quizLeads como fallback/registro local.
   * Trata localStorage indisponível e JSON corrompido sem quebrar o fluxo.
   * @param {{nome: string, whatsapp: string, email: string, resultado: string, timestamp: string}} data
   */
  function salvarLeadLocal(data) {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage indisponível — lead não pôde ser salvo localmente.');
      return;
    }

    let leads = [];
    try {
      const armazenado = localStorage.getItem('quizLeads');
      leads = armazenado ? JSON.parse(armazenado) : [];
      if (!Array.isArray(leads)) {
        leads = [];
      }
    } catch (erro) {
      // JSON inválido em quizLeads — reinicia a lista em vez de travar o salvamento
      console.error('quizLeads continha JSON inválido, reiniciando lista:', erro);
      leads = [];
    }

    leads.push(data);

    try {
      localStorage.setItem('quizLeads', JSON.stringify(leads));
    } catch (erro) {
      console.error('Erro ao salvar lead no localStorage:', erro);
    }
  }

  // Expõe apenas o necessário no escopo global; salvarLeadLocal fica privado.
  window.submitLead = submitLead;
})();
