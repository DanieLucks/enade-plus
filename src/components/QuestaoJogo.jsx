import React, { useState } from 'react';

export default function QuestaoJogo({ questao, vidas, onResponder }) {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [statusResposta, setStatusResposta] = useState(null);

  const handleVerificar = () => {
    if (!opcaoSelecionada) return;

    if (opcaoSelecionada === questao.resposta_correta) {
      setStatusResposta('correto');
    } else {
      setStatusResposta('errado');
    }
    setRespondido(true);
  };

  const handleContinuar = () => {
    const acertou = statusResposta === 'correto';
    onResponder(acertou);
    setOpcaoSelecionada(null);
    setRespondido(false);
    setStatusResposta(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.botaoFechar}>✕</button>
        <div style={styles.barraProgressoContainer}>
          <div style={{...styles.barraProgresso, width: '50%'}}></div>
        </div>
        <div style={styles.containerVidas}>
          <span style={styles.iconeCoracao}>❤️</span>
          <span style={styles.textoVidas}>{vidas}</span>
        </div>
      </div>

      <div style={styles.areaConteudo}>
        <span style={styles.tagAno}>ENADE {questao.ano_prova}</span>
        {/* Mapeado para o novo nome: enunciado_texto */}
        <p style={styles.enunciado}>{questao.enunciado_texto}</p>
        
        {/* Mapeado para o novo nome: afirmacoes_json */}
        {questao.afirmacoes_json && questao.afirmacoes_json.length > 0 && (
          <div style={styles.containerAfirmacoes}>
            {questao.afirmacoes_json.map((afirmacao) => (
              <p key={afirmacao.letra} style={styles.textoAfirmacao}>
                <strong>{afirmacao.letra}.</strong> {afirmacao.texto}
              </p>
            ))}
          </div>
        )}

        {/* Mapeado para o novo nome: alternativas_json */}
        <div style={styles.containerAlternativas}>
          {questao.alternativas_json.map((alt) => {
            const isSelected = opcaoSelecionada === alt.opcao;
            const isCorrectAnswer = alt.opcao === questao.resposta_correta;
            return (
              <button
                key={alt.opcao}
                disabled={respondido}
                onClick={() => setOpcaoSelecionada(alt.opcao)}
                style={{
                  ...styles.cardAlternativa,
                  ...(isSelected ? styles.cardSelecionado : {}),
                  ...(respondido && isCorrectAnswer ? styles.cardCertoFixo : {})
                }}
              >
                <span style={{
                  ...styles.badgeOpcao, 
                  ...(isSelected ? styles.badgeSelecionada : {})
                }}>
                  {alt.opcao}
                </span>
                <span style={styles.textoAlternativa}>{alt.texto}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        ...styles.painelInferior,
        ...(statusResposta === 'correto' ? styles.painelSucesso : {}),
        ...(statusResposta === 'errado' ? styles.painelErro : {})
      }}>
        {!respondido ? (
          <button 
            onClick={handleVerificar} 
            disabled={!opcaoSelecionada}
            style={{
              ...styles.botaoAcao, 
              ...(!opcaoSelecionada ? styles.botaoDesativado : styles.botaoVerificar)
            }}
          >
            VERIFICAR
          </button>
        ) : (
          <div style={styles.containerResultado}>
            <div style={styles.textoResultado}>
              {statusResposta === 'correto' ? (
                <h3 style={styles.tituloSucesso}>🎉 Muito bem!</h3>
              ) : (
                <>
                  <h3 style={styles.tituloErro}>😢 Resposta incorreta</h3>
                  <p style={styles.feedbackTexto}>{questao.feedback_resolucao}</p>
                </>
              )}
            </div>
            <button onClick={handleContinuar} style={styles.botaoContinuar}>
              CONTINUAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Os estilos (styles) permanecem exatamente idênticos aos anteriores...
const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#FFF', fontFamily: 'sans-serif' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '2px solid #E5E5E5' },
  botaoFechar: { background: 'none', border: 'none', fontSize: '20px', color: '#AFAFAF', cursor: 'pointer' },
  barraProgressoContainer: { flex: 1, height: '16px', backgroundColor: '#E5E5E5', borderRadius: '8px', margin: '0 15px', overflow: 'hidden' },
  barraProgresso: { height: '100%', backgroundColor: '#58CC02', borderRadius: '8px', transition: 'width 0.3s' },
  containerVidas: { display: 'flex', alignItems: 'center', gap: '5px' },
  iconeCoracao: { fontSize: '22px' },
  textoVidas: { fontSize: '18px', fontWeight: 'bold', color: '#FF4B4B' },
  areaConteudo: { flex: 1, padding: '20px', overflowY: 'auto', paddingBottom: '160px' },
  tagAno: { backgroundColor: '#E5F2FF', color: '#1890FF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  enunciado: { fontSize: '16px', color: '#3C3C3C', lineHeight: '1.5', margin: '15px 0' },
  containerAfirmacoes: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', paddingLeft: '10px', borderLeft: '3px solid #E5E5E5' },
  textoAfirmacao: { fontSize: '14px', color: '#4B4B4B', margin: 0 },
  containerAlternativas: { display: 'flex', flexDirection: 'column', gap: '12px' },
  cardAlternativa: { display: 'flex', alignItems: 'center', padding: '14px', borderRadius: '12px', border: '2px solid #E5E5E5', backgroundColor: '#FFF', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', width: '100%' },
  cardSelecionado: { border: '2px solid #84D8FF', backgroundColor: '#DDF4FF' },
  cardCertoFixo: { border: '2px solid #58CC02', backgroundColor: '#E5F9D3' },
  badgeOpcao: { width: '28px', height: '28px', border: '2px solid #E5E5E5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#AFAFAF', marginRight: '12px', flexShrink: 0 },
  badgeSelecionada: { border: '2px solid #84D8FF', color: '#1890FF', backgroundColor: '#FFF' },
  textoAlternativa: { fontSize: '15px', color: '#4B4B4B' },
  painelInferior: { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', borderTop: '2px solid #E5E5E5', backgroundColor: '#FFF', display: 'flex', justifyContent: 'center', zIndex: 10 },
  painelSucesso: { backgroundColor: '#E5F9D3', borderTop: '2px solid #A8E474' },
  painelErro: { backgroundColor: '#FFD8D8', borderTop: '2px solid #FF8F8F' },
  botaoAcao: { width: '100%', maxWidth: '400px', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' },
  botaoDesativado: { backgroundColor: '#E5E5E5', color: '#AFAFAF', cursor: 'not-allowed', boxShadow: 'none' },
  botaoVerificar: { backgroundColor: '#58CC02', color: '#FFF' },
  containerResultado: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px' },
  textoResultado: { textAlign: 'left' },
  tituloSucesso: { color: '#58A700', margin: '0 0 5px 0' },
  tituloErro: { color: '#EA2B2B', margin: '0 0 5px 0' },
  feedbackTexto: { fontSize: '14px', color: '#EA2B2B', margin: 0, lineHeight: '1.4' },
  botaoContinuar: { padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', backgroundColor: '#58CC02', color: '#FFF' }
};