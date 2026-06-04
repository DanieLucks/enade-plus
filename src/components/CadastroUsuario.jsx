import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient.js';

export default function CadastroUsuario({ onCadastroSucesso, onIrParaLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagemErro('');

    // Cria a credencial e anexa o nome de exibição nos metadados opcionais
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: senha,
      options: {
        data: {
          nome_exibicao: nome
        }
      }
    });

    if (authError) {
      setMensagemErro(`Erro na autenticação: ${authError.message}`);
      setCarregando(false);
      return;
    }

    if (authData?.user) {
      console.log('✅ Credencial aceita. Perfil gerado via Trigger de Banco.');
      onCadastroSucesso(authData.user);
    }

    setCarregando(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.logoCoruja}>🦉</span>
        <h2 style={styles.titulo}>Crie sua conta no ENADE+</h2>
        <p style={styles.subtitulo}>Pratique diariamente e acompanhe sua evolução!</p>

        {mensagemErro && <div style={styles.erroBox}>{mensagemErro}</div>}

        <form onSubmit={handleCadastro} style={styles.form}>
          <label style={styles.label}>Nome de Exibição</label>
          <input type="text" required placeholder="Ex: Lucas Costa" value={nome} onChange={e => setNome(e.target.value)} style={styles.input} />

          <label style={styles.label}>E-mail</label>
          <input type="email" required placeholder="seuemail@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />

          <label style={styles.label}>Senha (mínimo 6 caracteres)</label>
          <input type="password" required placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} style={styles.input} />

          <button type="submit" disabled={carregando} style={styles.botaoCadastrar}>
            {carregando ? 'CRIANDO CONTA...' : 'CADASTRAR'}
          </button>
        </form>

        <button onClick={onIrParaLogin} style={styles.botaoLink}>
          Já tem uma conta? Entre por aqui!
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F7F7F7', padding: '20px', fontFamily: 'sans-serif' },
  card: { backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', border: '2px solid #E5E5E5', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 4px 0 #E5E5E5' },
  logoCoruja: { fontSize: '50px', display: 'block', marginBottom: '10px' },
  titulo: { fontSize: '22px', color: '#3C3C3C', margin: '0 0 8px 0', fontWeight: 'bold' },
  subtitulo: { fontSize: '14px', color: '#777', margin: '0 0 20px 0' },
  erroBox: { backgroundColor: '#FFD8D8', color: '#EA2B2B', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', border: '1px solid #FF8F8F', textAlign: 'left' },
  form: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#4B4B4B', marginBottom: '5px' },
  input: { padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px', marginBottom: '15px', fontSize: '15px', outline: 'none' },
  botaoCadastrar: { padding: '14px', backgroundColor: '#58CC02', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #388E3C', marginTop: '10px' },
  botaoLink: { background: 'none', border: 'none', color: '#1890FF', marginTop: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }
};