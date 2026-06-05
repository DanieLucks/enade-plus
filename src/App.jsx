import React, { useState, useEffect } from 'react';
import QuestaoJogo from './components/QuestaoJogo.jsx';
import AulaRapida from './components/AulaRapida.jsx';
import TelaFeedbackFinal from './components/TelaFeedbackFinal.jsx';
import CadastroUsuario from './components/CadastroUsuario.jsx';
import LoginUsuario from './components/LoginUsuario.jsx';
import MenuInicial from './components/MenuInicial.jsx'; // 🚀 Importação do novo Painel
import { supabase } from './services/supabaseClient.js';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [questoes, setQuestoes] = useState([]);
  const [indiceQuestao, setIndiceQuestao] = useState(0);
  const [vidas, setVidas] = useState(5);
  // 🧭 Rota 'menu' e 'aula' adicionadas ao fluxo oficial
  const [telaAtual, setTelaAtual] = useState('autenticando'); // 'autenticando' | 'cadastro' | 'login' | 'menu' | 'carregando' | 'jogo' | 'aula' | 'aula_recuperacao' | 'final'
  const [aulaAtual, setAulaAtual] = useState(null);
  const [xp, setXp] = useState(0);

  // Mapeia a questão ativa com segurança baseado no array vindo da nuvem
  const questaoAtual = questoes[indiceQuestao];

  // 1. Gerenciamento de Sessão e Autenticação Protegido contra Loops
  useEffect(() => {
    let carregandoInicial = true;

    async function inicializarSessao() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUsuario(session.user);
        setTelaAtual('menu'); // 🚀 Usuário logado vai direto para o Menu Inicial
      } else {
        setTelaAtual('login');
      }
      carregandoInicial = false;
    }

    inicializarSessao();

    // Monitora logins/logouts em tempo real pós-carregamento inicial
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (carregandoInicial) return; 

      if (session && event === 'SIGNED_IN') {
        setUsuario(session.user);
        setTelaAtual('menu'); // 🚀 Login joga para o Menu Inicial, não mais para o jogo direto
      } else if (event === 'SIGNED_OUT' || !session) {
        setUsuario(null);
        setQuestoes([]);
        setIndiceQuestao(0);
        setTelaAtual('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Busca de Questões via Banco de Dados (Chamado apenas quando o usuário clica no Simulado)
  async function buscarQuestoes() {
    setTelaAtual('carregando');
    
    const { data, error } = await supabase
      .from('dim_questoes')
      .select('*')
      .order('sk_questao', { ascending: true });

    if (error) {
      console.error('Erro ao coletar dimensões:', error.message);
      setTelaAtual('menu');
      return;
    }

    if (data && data.length > 0) {
      setQuestoes(data);
      setIndiceQuestao(0); // Garante o reinício na questão zero
      setTelaAtual('jogo'); 
    } else {
      console.warn('Banco de dados dimensional sem linhas cadastradas.');
      setTelaAtual('menu');
    }
  }

  // 3. Busca Dinâmica de Pílulas de Conhecimento Autônomas (Modo Aula Rápida)
  const carregarAulaRapidaGeral = async () => {
    setTelaAtual('carregando');
    const { data, error } = await supabase
      .from('dim_aulas')
      .select('*')
      .eq('sk_aula', 'aula_mobilidade_social') // Carrega a primeira aula por padrão no MVP
      .single();

    if (error) {
      console.error('Erro ao carregar dim_aulas:', error.message);
      setTelaAtual('menu');
    } else {
      setAulaAtual(data);
      setTelaAtual('aula'); // Encaminha para a rota de leitura simples
    }
  };

  // 4. Lógica de Resposta e Atualização do Estado de Vidas
  const handleRespostaQuestao = (acertou) => {
    if (!acertou) {
      setVidas((vidasAtuais) => {
        const novasVidas = vidasAtuais - 1;
        if (novasVidas <= 0) {
          setTelaAtual('final'); // 🛠️ Corrigido de 'feedback-final' para 'final' para bater com o estado
        }
        return novasVidas;
      });
    } else {
      setXp(prev => prev + 10); // Adiciona XP por acerto
      console.log("Acertou! Adicionando pontos...");
    }

    // Avança para a próxima questão independente de ter acertado ou errado
    setIndiceQuestao((indiceAtual) => {
      const proximoIndice = indiceAtual + 1;

      if (proximoIndice < questoes.length) {
        return proximoIndice; 
      } else {
        setTelaAtual('final'); // 🛠️ Corrigido para 'final'
        return indiceAtual;
      }
    });
  };

  // 5. Avança o Ponteiro do Vetor de Questões
  const avancarFluxo = () => {
    if (indiceQuestao + 1 < questoes.length) {
      setIndiceQuestao(prev => prev + 1);
      setTelaAtual('jogo');
    } else {
      setTelaAtual('final'); 
    }
  };

  // 6. Restaura as Vidas após a Leitura da Aula Rápida de Recuperação
  const handleConcluirAulaRecuperacao = () => {
    setVidas(5);
    setXp(prev => prev + 5);
    avancarFluxo();
  };

  // 7. Reseta o Loop de Questões (Volta ao Menu Principal)
  const handleResetarBanco = () => {
    console.log("🔄 Retornando ao menu principal...");
    setIndiceQuestao(0);   
    setVidas(5);           
    setXp(0);              
    setTelaAtual('menu');  // 🚀 Redireciona o usuário de volta ao painel principal
  };
  
  // Renderização Global das Telas de Espera Assíncronas
  if (telaAtual === 'autenticando' || telaAtual === 'carregando') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#666' }}>
        <h2>Carregando ENADE+ ...</h2>
      </div>
    );
  }

  // Renderização Dinâmica das Telas do MVP
  return (
    <div>
      {telaAtual === 'login' && (
        <LoginUsuario 
          onLoginSucesso={(user) => {
            setUsuario(user);
            setTelaAtual('menu'); // 🚀 Vai para o menu
          }}
          onIrParaCadastro={() => setTelaAtual('cadastro')}
        />
      )}

      {telaAtual === 'cadastro' && (
        <CadastroUsuario 
          onCadastroSucesso={(user) => {
            setUsuario(user);
            setTelaAtual('menu'); // 🚀 Vai para o menu
          }}
          onIrParaLogin={() => setTelaAtual('login')}
        />
      )}

      {/* 🎯 TELA DO MENU INICIAL INTEGRADA */}
      {telaAtual === 'menu' && (
        <MenuInicial 
          usuarioAuth={usuario}
          onEscolherModo={(modo) => {
            if (modo === 'aula') {
              carregarAulaRapidaGeral(); // Executa o fetch da pílula Markdown
            } else if (modo === 'jogo') {
              buscarQuestoes(); // Faz a carga das perguntas e dispara a tela 'jogo'
            }
          }}
          onLogout={async () => {
            await supabase.auth.signOut();
            setUsuario(null);
            setTelaAtual('login');
          }}
        />
      )}

      {telaAtual === 'jogo' && questaoAtual && (
        <QuestaoJogo 
          key={questaoAtual.sk_questao} 
          questao={questaoAtual}
          vidas={vidas} 
          onResponder={handleRespostaQuestao}
        />
      )}

      {/* Renderiza o componente de Aula Rápida Normal */}
      {telaAtual === 'aula' && aulaAtual && (
        <AulaRapida 
          aula={aulaAtual} 
          onConcluir={() => setTelaAtual('menu')} // Retorna de forma limpa ao painel
        />
      )}

      {telaAtual === 'aula_recuperacao' && aulaAtual && (
        <AulaRapida 
          aula={aulaAtual} 
          onConcluir={handleConcluirAulaRecuperacao} 
        />
      )}

      {telaAtual === 'final' && (
        <TelaFeedbackFinal 
          xpGanhado={xp} 
          ofensivaAtual={1} 
          onVoltarAoInicio={handleResetarBanco} 
        />
      )}
    </div>
  );
}