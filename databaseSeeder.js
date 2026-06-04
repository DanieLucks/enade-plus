import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Carrega as variáveis declaradas no .env local
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Erro Crítico: Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontradas.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function semearTabelaQuestoes() {
  console.log("⏳ Abrindo arquivo de dados local (dados_origem.json)...");
  
  try {
    const dadosBrutos = fs.readFileSync('./dados_origem.json', 'utf-8');
    const loteQuestoes = JSON.parse(dadosBrutos);

    console.log(`🚀 Semeando ${loteQuestoes.length} questões na tabela public.dim_questoes...`);

    // Realiza o upsert mapeando conflitos na PK dimensional
    const { data, error } = await supabase
      .from('dim_questoes')
      .upsert(loteQuestoes, { onConflict: 'sk_questao' });

    if (error) {
      throw error;
    }

    console.log("✅ Concluído! O banco relacional dimensional foi atualizado na nuvem.");
  } catch (err) {
    console.error("❌ Falha no carregamento dos dados para o Supabase:", err.message);
  }
}

semearTabelaQuestoes();