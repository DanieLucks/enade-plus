import React, { useState, useEffect } from 'react';
import QuestaoJogo from './components/QuestaoJogo.jsx';
import AulaRapida from './components/AulaRapida.jsx';
import TelaFeedbackFinal from './components/TelaFeedbackFinal.jsx';
import CadastroUsuario from './components/CadastroUsuario.jsx';
import LoginUsuario from './components/LoginUsuario.jsx';
import { supabase } from './services/supabaseClient.js';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [questoes, setQuestoes] = useState([]);
  const [indiceQuestao, setIndiceQuestao] = useState(0);
  const [vidas, setVidas] = useState(5);
  const [telaAtual, setTelaAtual] = useState('autenticando'); // 'autenticando' | 'cadastro' | 'login' | 'carregando' | 'jogo' | 'aula_recuperacao' | 'final'
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
        await buscarQuestoes();
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
        buscarQuestoes();
      } else if (event === 'SIGNED_OUT' || !session) {
        setUsuario(null);
        setQuestoes([]);
        setIndiceQuestao(0);
        setTelaAtual('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

async function buscarQuestoes() {
    setTelaAtual('carregando');
    
    const { data, error } = await supabase
      .from('dim_questoes')
      .select('*')
      .order('sk_questao', { ascending: true });

    if (error) {
      console.error('Erro ao coletar dimensões:', error.message);
      setTelaAtual('login');
      return;
    }

    if (data && data.length > 0) {
      setQuestoes(data);
      setIndiceQuestao(0); // Garante o reinício na questão zero
      setTelaAtual('jogo');  // Destino obrigatório
    } else {
      console.warn('Banco de dados dimensional sem linhas cadastradas.');
      setTelaAtual('login');
    }
  }

  // 3. Busca Dinâmica de Pílulas de Conhecimento (dim_aulas)
  const carregarAulaRecuperacao = async (aulaId) => {
    setTelaAtual('carregando');
    const { data, error } = await supabase
      .from('dim_aulas')
      .select('*')
      .eq('sk_aula', aulaId)
      .single();

    if (error) {
      console.error('Erro ao carregar dim_aulas:', error.message);
      avancarFluxo(); 
    } else {
      setAulaAtual(data);
      setTelaAtual('aula_recuperacao');
    }
  };

  // 4. Lógica de Resposta e Atualização do Estado de Vidas
  const handleRespostaQuestao = (acertou) => {
    if (!acertou) {
    // Se o aluno errou, decrementa uma vida
    setVidas((vidasAtuais) => {
      const novasVidas = vidasAtuais - 1;
      if (novasVidas <= 0) {
        setTelaAtual('feedback-final'); // Game Over se acabarem as vidas
      }
      return novasVidas;
    });
  } else {
    // Se acertou, você pode somar pontuação/XP aqui se desejar
    console.log("Acertou! Adicionando pontos...");
  }

  // 🚀 AQUI ESTÁ A CORREÇÃO: Avança para a próxima questão independente de ter acertado ou errado
  setIndiceQuestao((indiceAtual) => {
    const proximoIndice = indiceAtual + 1;

    // Verifica se ainda existem questões no vetor
    if (proximoIndice < questoes.length) {
      return proximoIndice; // Muda o estado e o React renderiza a próxima
    } else {
      setTelaAtual('feedback-final'); // Fim do bloco de questões (Vitória)
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
      setTelaAtual('final'); // Fim do bloco atual de questões cadastrado
    }
  };

  // 6. Restaura as Vidas após a Leitura da Aula Rápida
  const handleConcluirAulaRecuperacao = () => {
    setVidas(5);
    setXp(prev => prev + 5);
    avancarFluxo();
  };

  // 7. Reseta o Loop de Questões (Acionado pelo Botão Continuar da Tela Final)
  const handleResetarBanco = () => {
    console.log("🔄 Reiniciando o loop de lições...");
    setIndiceQuestao(0);   // Joga o ponteiro de volta para a primeira pergunta (Índice 0)
    setVidas(5);           // Devolve a barra cheia com 5 vidas para recomeçar
    setXp(0);              // Limpa a pontuação do ciclo temporário
    setTelaAtual('jogo');  // Força o componente de lições a reassumir a tela
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
            buscarQuestoes();
          }}
          onIrParaCadastro={() => setTelaAtual('cadastro')}
        />
      )}

      {telaAtual === 'cadastro' && (
        <CadastroUsuario 
          onCadastroSucesso={(user) => {
            setUsuario(user);
            buscarQuestoes();
          }}
          onIrParaLogin={() => setTelaAtual('login')}
        />
      )}

      {telaAtual === 'jogo' && questaoAtual && (
        <QuestaoJogo 
          key={questaoAtual.sk_questao} // Força o React a remontar a árvore visual e limpar seleções antigas
          questao={questaoAtual}
          vidas={vidas} 
          onResponder={handleRespostaQuestao}
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
          onVoltarAoInicio={handleResetarBanco} // Amarra o clique do botão Continuar para resetar o loop
        />
      )}
    </div>
  );
}