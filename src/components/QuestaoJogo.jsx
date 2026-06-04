import React, { useState } from 'react';

export default function QuestaoJogo({ questao, vidas, onResponder }) {
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('');
  const [respondido, setRespondido] = useState(false);
  const [resultado, setResultado] = useState(null); // { acertou: boolean, feedback: string }

  const abas = questao.conteudos_abas_json || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!opcaoSelecionada || respondido) return;

    const acertou = opcaoSelecionada === questao.resposta_correta;
    setRespondido(true);
    setResultado({
      acertou,
      feedback: questao.feedback_resolucao
    });
  };

  const handleAvancar = () => {
    onResponder(resultado.acertou);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topoBarra}>
        <span style={styles.vidas}>❤️ Vidas: {vidas}</span>
        <span style={styles.ano}>ENADE {questao.ano_prova}</span>
      </div>

      <div style={styles.card}>
        {/* ================= BOX DE ABAS DINÂMICAS ================= */}
        {abas.length > 0 && (
          <div style={styles.containerAbas}>
            <div style={styles.AbasHeader}>
              {abas.map((aba, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAbaAtiva(index)}
                  style={{
                    ...styles.botaoAba,
                    ...(abaAtiva === index ? styles.abaAtiva : {})
                  }}
                >
                  {aba.titulo}
                </button>
              ))}
            </div>
            
            <div style={styles.AbasConteudo}>
              {abas[abaAtiva].tipo === 'imagem' ? (
                <img 
                  src={abas[abaAtiva].conteudo} 
                  alt={abas[abaAtiva].titulo} 
                  style={styles.imagemAba} 
                />
              ) : (
                <p style={styles.textoAba}>{abas[abaAtiva].conteudo}</p>
              )}
            </div>
          </div>
        )}
        {/* ========================================================= */}

        <h3 style={styles.enunciado}>{questao.enunciado_texto}</h3>

        {/* Renderiza afirmações intermediárias (I, II, III) se existirem */}
        {questao.afirmacoes_json && questao.afirmacoes_json.length > 0 && (
          <div style={styles.boxAfirmacoes}>
            {questao.afirmacoes_json.map((af, i) => (
              <p key={i} style={styles.textoAfirmacao}>
                <strong>{af.letra}:</strong> {af.texto}
              </p>
            ))}
          </div>
        )}

        {/* Formulário de Alternativas (Sempre fixo embaixo do conteúdo) */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {questao.alternativas_json.map((alt) => {
            const IsSelected = opcaoSelecionada === alt.opcao;
            return (
              <label 
                key={alt.opcao} 
                style={{
                  ...styles.opcaoLabel,
                  ...(IsSelected ? styles.opcaoSelecionada : {})
                }}
              >
                <input
                  type="radio"
                  name="alternativa"
                  value={alt.opcao}
                  disabled={respondido}
                  checked={opcaoSelecionada === alt.opcao}
                  onChange={(e) => setOpcaoSelecionada(e.target.value)}
                  style={styles.radioOculto}
                />
                <span style={{
                  ...styles.letraCirculo,
                  ...(IsSelected ? styles.letraCirculoSelecionada : {})
                }}>
                  {alt.opcao}
                </span>
                <span style={styles.textoAlternativa}>{alt.texto}</span>
              </label>
            );
          })}

          {!respondido ? (
            <button 
              type="submit" 
              disabled={!opcaoSelecionada} 
              style={{
                ...styles.botaoVerificar,
                ...(!opcaoSelecionada ? styles.botaoDesativado : {})
              }}
            >
              VERIFICAR RESPOSTA
            </button>
          ) : (
            <div style={{
              ...styles.boxFeedback,
              ...(resultado.acertou ? styles.feedbackAcerto : styles.feedbackErro)
            }}>
              <h4>{resultado.acertou ? '🎉 Excelente Trabalho!' : '😢 Não foi dessa vez'}</h4>
              <p>{resultado.feedback}</p>
              <button type="button" onClick={handleAvancar} style={styles.botaoContinuar}>
                CONTINUAR
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#F7F7F7', padding: '20px', fontFamily: 'sans-serif' },
  topoBarra: { display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '650px', marginBottom: '10px', fontWeight: 'bold', color: '#555' },
  card: { backgroundColor: '#FFF', padding: '25px', borderRadius: '16px', border: '2px solid #E5E5E5', width: '100%', maxWidth: '650px', boxShadow: '0 4px 0 #E5E5E5' },
  
  // Estilização das Abas (Estilo Duolingo/Navegador moderno)
  containerAbas: { border: '2px solid #E5E5E5', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#FFF' },
  AbasHeader: { display: 'flex', backgroundColor: '#F0F0F0', borderBottom: '2px solid #E5E5E5' },
  botaoAba: { flex: 1, padding: '12px', border: 'none', background: 'none', fontWeight: 'bold', color: '#777', cursor: 'pointer', transition: '0.2s', borderRight: '1px solid #E5E5E5' },
  abaAtiva: { backgroundColor: '#FFF', color: '#58CC02', borderBottom: '3px solid #58CC02', marginBottom: '-2px' },
  AbasConteudo: { padding: '15px', backgroundColor: '#FFF', display: 'flex', justifyContent: 'center' },
  textoAba: { margin: 0, fontSize: '15px', color: '#3C3C3C', lineHeight: '1.5', textAlign: 'justify' },
  imagemAba: { maxWidth: '100%', height: 'auto', borderRadius: '8px', maxHeight: '250px', objectFit: 'contain' },

  enunciado: { fontSize: '16px', color: '#3C3C3C', lineHeight: '1.6', margin: '0 0 20px 0', textAlign: 'justify' },
  boxAfirmacoes: { backgroundColor: '#F9F9F9', padding: '15px', borderRadius: '12px', border: '1px solid #E5E5E5', marginBottom: '25px' },
  textoAfirmacao: { fontSize: '14px', margin: '0 0 8px 0', color: '#4B4B4B' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  opcaoLabel: { display: 'flex', alignItems: 'center', padding: '14px', border: '2px solid #E5E5E5', borderRadius: '14px', cursor: 'pointer', transition: '0.15s', boxShadow: '0 3px 0 #E5E5E5' },
  opcaoSelecionada: { borderColor: '#84D8FF', backgroundColor: '#DDF4FF', boxShadow: '0 3px 0 #84D8FF' },
  radioOculto: { display: 'none' },
  letraCirculo: { width: '28px', height: '28px', border: '2px solid #E5E5E5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#777', marginRight: '12px', backgroundColor: '#FFF' },
  letraCirculoSelecionada: { borderColor: '#1890FF', color: '#1890FF', backgroundColor: '#FFF' },
  textoAlternativa: { fontSize: '15px', color: '#3C3C3C', flex: 1 },
  botaoVerificar: { padding: '16px', backgroundColor: '#58CC02', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #388E3C', marginTop: '15px' },
  botaoDesativado: { backgroundColor: '#E5E5E5', color: '#AFAFAF', boxShadow: 'none', cursor: 'not-allowed' },
  boxFeedback: { padding: '15px', borderRadius: '12px', marginTop: '15px', border: '2px solid' },
  feedbackAcerto: { backgroundColor: '#D7F5D9', borderColor: '#58CC02', color: '#257429' },
  feedbackErro: { backgroundColor: '#FFE6E6', borderColor: '#FF4D4D', color: '#A81C1C' },
  botaoContinuar: { padding: '12px 24px', backgroundColor: '#FFF', border: '2px solid', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};