import React from 'react';

export default function AulaRapida({ aula, onConcluir }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.emojiLivro}>📚</span>
        <h2 style={styles.tituloHeader}>Pílula de Conhecimento</h2>
        <p style={styles.subtituloHeader}>Estude este conceito rápido para recuperar suas vidas!</p>
      </div>
      
      <div style={styles.card}>
        {/* Atualizado para titulo_aula */}
        <h3 style={styles.tituloAula}>{aula.titulo_aula}</h3>
        <p style={styles.conteudoAula}>{aula.conteudo_markdown}</p>
      </div>

      <button onClick={onConcluir} style={styles.botaoGanhaVida}>
        ❤️ Entendi, Restaurar Vidas!
      </button>
    </div>
  );
}

// Os estilos (styles) permanecem os mesmos fornecidos na resposta anterior...
const styles = {
  container: { padding: '30px 20px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#F7F7F7', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  header: { marginBottom: '25px' },
  emojiLivro: { fontSize: '40px', display: 'block', marginBottom: '10px' },
  tituloHeader: { fontSize: '22px', color: '#3C3C3C', margin: '0 0 8px 0', fontWeight: 'bold' },
  subtituloHeader: { fontSize: '14px', color: '#777', margin: 0 },
  card: { backgroundColor: '#FFF', padding: '25px', borderRadius: '16px', border: '2px solid #E5E5E5', textAlign: 'left', marginBottom: '35px', lineHeight: '1.6', width: '100%', maxWidth: '450px', boxShadow: '0 4px 0 #E5E5E5' },
  tituloAula: { fontSize: '18px', color: '#1F1F1F', marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #F0F0F0', paddingBottom: '10px' },
  conteudoAula: { fontSize: '15px', color: '#4B4B4B', whiteSpace: 'pre-line', margin: 0 },
  botaoGanhaVida: { width: '100%', maxWidth: '450px', padding: '14px', backgroundColor: '#1890FF', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #0050B3' }
};