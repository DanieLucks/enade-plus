import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient.js';

export default function MenuInicial({ usuarioAuth, onEscolherModo, onLogout }) {
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDadosPerfil() {
      try {
        // Busca o nome de exibição e a ofensiva direto da tabela dimensional
        const { data, error } = await supabase
          .from('dim_usuarios')
          .select('nome_exibicao, ofensiva_atual')
          .eq('sk_usuario', usuarioAuth.id)
          .single();

        if (error) throw error;
        setPerfil(data);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error.message);
      } finally {
        setCarregando(false);
      }
    }

    if (usuarioAuth) {
      carregarDadosPerfil();
    }
  }, [usuarioAuth]);

  if (carregando) {
    return <div style={styles.container}>Carregando seu painel...</div>;
  }

  return (
    <div style={styles.container}>
      {/* BARRA DE TOPO DO PERFIL */}
      <div style={styles.topoBarra}>
        <div style={styles.usuarioInfo}>
          <span style={styles.avatar}>🎓</span>
          <div>
            <h3 style={styles.saudacao}>Olá, {perfil?.nome_exibicao || 'Estudante'}!</h3>
            <p style={styles.subSaudacao}>Pronto para os desafios de hoje?</p>
          </div>
        </div>
        
        {/* CONTADOR DE OFENSIVA (STREAK) */}
        <div style={styles.boxOfensiva} title="Dias seguidos praticando!">
          <span style={styles.fogoEmoji}>🔥</span>
          <span style={styles.ofensivaNumero}>{perfil?.ofensiva_atual || 0} dias</span>
        </div>
      </div>

      {/* CARD PRINCIPAL DE SELEÇÃO DE MODOS */}
      <div style={styles.cardMenu}>
        <h2 style={styles.tituloPainel}>Painel de Treinamento ENADE+</h2>
        <p style={styles.descricaoPainel}>
          Escolha como você deseja se preparar para o exame de Sistemas de Informação agora:
        </p>

        <div style={styles.gridModos}>
          {/* OPÇÃO 1: AULA RÁPIDA */}
          <button onClick={() => onEscolherModo('aula')} style={styles.botaoModoAula}>
            <span style={styles.modoIcone}>⚡</span>
            <div style={styles.modoTextoContainer}>
              <strong style={styles.modoTitulo}>Aula Rápida</strong>
              <span style={styles.modoSubtitulo}>Estude pílulas de conhecimento em Markdown antes de praticar.</span>
            </div>
          </button>

          {/* OPÇÃO 2: QUESTIONÁRIO */}
          <button onClick={() => onEscolherModo('jogo')} style={styles.botaoModoJogo}>
            <span style={styles.modoIcone}>🎯</span>
            <div style={styles.modoTextoContainer}>
              <strong style={styles.modoTitulo}>Simulado / Questionário</strong>
              <span style={styles.modoSubtitulo}>Enfratando questões reais do ENADE com controle de vidas.</span>
            </div>
          </button>
        </div>

        <button onClick={onLogout} style={styles.botaoLogout}>
          Desconectar Conta
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#F7F7F7', padding: '20px', fontFamily: 'sans-serif' },
  topoBarra: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', backgroundColor: '#FFF', padding: '15px 20px', borderRadius: '16px', border: '2px solid #E5E5E5', marginBottom: '20px', boxShadow: '0 4px 0 #E5E5E5' },
  usuarioInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatar: { fontSize: '35px' },
  saudacao: { margin: 0, fontSize: '18px', color: '#3C3C3C', fontWeight: 'bold' },
  subSaudacao: { margin: '2px 0 0 0', fontSize: '13px', color: '#777' },
  boxOfensiva: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFF0E6', border: '2px solid #FF964B', padding: '8px 12px', borderRadius: '12px', fontWeight: 'bold' },
  fogoEmoji: { fontSize: '20px' },
  ofensivaNumero: { color: '#E65C00', fontSize: '15px' },
  
  cardMenu: { backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', border: '2px solid #E5E5E5', width: '100%', maxWidth: '600px', textAlign: 'center', boxShadow: '0 4px 0 #E5E5E5' },
  tituloPainel: { fontSize: '22px', color: '#3C3C3C', margin: '0 0 10px 0', fontWeight: 'bold' },
  descricaoPainel: { fontSize: '14px', color: '#777', margin: '0 0 25px 0', lineHeight: '1.4' },
  
  gridModos: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' },
  botaoModoAula: { display: 'flex', alignItems: 'center', padding: '18px', backgroundColor: '#FFF', border: '2px solid #E5E5E5', borderRadius: '16px', cursor: 'pointer', textAlign: 'left', transition: '0.15s', boxShadow: '0 4px 0 #E5E5E5', gap: '15px' },
  botaoModoJogo: { display: 'flex', alignItems: 'center', padding: '18px', backgroundColor: '#FFF', border: '2px solid #E5E5E5', borderRadius: '16px', cursor: 'pointer', textAlign: 'left', transition: '0.15s', boxShadow: '0 4px 0 #E5E5E5', gap: '15px' },
  modoIcone: { fontSize: '30px' },
  modoTextoContainer: { display: 'flex', flexDirection: 'column', gap: '4px' },
  modoTitulo: { fontSize: '16px', color: '#3C3C3C' },
  modoSubtitulo: { fontSize: '13px', color: '#777', fontWeight: 'normal', lineHeight: '1.3' },
  
  botaoLogout: { background: 'none', border: 'none', color: '#FF4D4D', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginTop: '10px', transition: '0.2s' }
};