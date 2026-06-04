import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient.js';

export default function LoginUsuario({ onLoginSucesso, onIrParaCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagemErro('');

    // Autentica o usuário com e-mail e senha no Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      setMensagemErro(`Erro ao entrar: ${error.message}`);
      setCarregando(false);
      return;
    }

    if (data?.user) {
      console.log('✅ Login realizado com sucesso!');
      onLoginSucesso(data.user);
    }
    setCarregando(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.logoCoruja}>🦉</span>
        <h2 style={styles.titulo}>Entrar no ENADE+</h2>
        <p style={styles.subtitulo}>Continue praticando para gabaritar a prova!</p>

        {mensagemErro && <div style={styles.erroBox}>{mensagemErro}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>E-mail Cadastrado</label>
          <input 
            type="email" 
            required 
            placeholder="seuemail@exemplo.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={styles.input}
          />

          <label style={styles.label}>Senha</label>
          <input 
            type="password" 
            required 
            placeholder="••••••••" 
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            style={styles.input}
          />

          <button type="submit" disabled={carregando} style={styles.botaoEntrar}>
            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <button onClick={onIrParaCadastro} style={styles.botaoLink}>
          Não tem uma conta ainda? Cadastre-se aqui!
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
  botaoEntrar: { padding: '14px', backgroundColor: '#58CC02', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #388E3C', marginTop: '10px' },
  botaoLink: { background: 'none', border: 'none', color: '#1890FF', marginTop: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }
};