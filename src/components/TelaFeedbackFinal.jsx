import React from 'react';

export default function TelaFeedbackFinal({ xpGanhado, ofensivaAtual, onVoltarAoInicio }) {
  return (
    <div style={styles.container}>
      <div style={styles.animacaoContainer}>
        <span style={styles.trofeu}>🏆</span>
        <h2 style={styles.titulo}>Lição Concluída!</h2>
        <p style={styles.subtitulo}>Você está mais perto de gabaritar o ENADE!</p>
      </div>

      <div style={styles.statusCardsContainer}>
        {/* Card de XP */}
        <div style={styles.cardStatus}>
          <span style={styles.iconeCard}>⚡</span>
          <span style={styles.textoCardTitulo}>XP GANHO</span>
          <span style={styles.textoCardValor}>+{xpGanhado}</span>
        </div>

        {/* Card de Ofensiva */}
        <div style={styles.cardStatus}>
          <span style={styles.iconeCard}>🔥</span>
          <span style={styles.textoCardTitulo}>OFENSIVA</span>
          <span style={styles.textoCardValor}>{ofensivaAtual} dias</span>
        </div>
      </div>

      <button onClick={onVoltarAoInicio} style={styles.botaoFinalizar}>
        CONTINUAR
      </button>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#FFF' },
  animacaoContainer: { textAlign: 'center', marginBottom: '40px' },
  trofeu: { fontSize: '80px', display: 'block', marginBottom: '10px' },
  titulo: { fontSize: '28px', color: '#58CC02', margin: '0 0 10px 0', fontWeight: 'bold' },
  subtitulo: { fontSize: '16px', color: '#777', margin: 0 },
  statusCardsContainer: { display: 'flex', gap: '20px', width: '100%', maxWidth: '400px', marginBottom: '50px' },
  cardStatus: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px', borderRadius: '16px', border: '2px solid #E5E5E5', boxShadow: '0 4px 0 #E5E5E5' },
  iconeCard: { fontSize: '24px', marginBottom: '5px' },
  textoCardTitulo: { fontSize: '12px', color: '#AFAFAF', fontWeight: 'bold', letterSpacing: '0.8px' },
  textoCardValor: { fontSize: '20px', color: '#4B4B4B', fontWeight: 'bold', marginTop: '5px' },
  botaoFinalizar: { width: '100%', maxWidth: '400px', padding: '14px', backgroundColor: '#58CC02', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #388E3C', transition: 'background-color 0.2s' }
};