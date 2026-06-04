import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Erro: Variáveis de conexão não encontradas no arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function semearDimensoes() {
  try {
    console.log('⏳ Carregando arquivo dados_origem.json...');
    const dadosRaw = fs.readFileSync('./dados_origem.json', 'utf8');
    const { mundos, topicos, aulas, questoes } = JSON.parse(dadosRaw);

    // Validação de segurança local para checar se o JSON quebrou no parse
    if (!mundos || !Array.isArray(mundos) || mundos.length === 0) {
      throw new Error("O array 'mundos' no JSON está vazio ou é inválido.");
    }

    // 1. Popular dim_mundos
    console.log('🚀 Inserindo dados em dim_mundos...');
    const { error: errMundos } = await supabase.from('dim_mundos').upsert(mundos);
    if (errMundos) throw new Error(`Erro dim_mundos: ${errMundos.message}`);

    // 2. Popular dim_topicos
    console.log('🚀 Inserindo dados em dim_topicos...');
    const { error: errTopicos } = await supabase.from('dim_topicos').upsert(topicos);
    if (errTopicos) throw new Error(`Erro dim_topicos: ${errTopicos.message}`);

    // 3. Popular dim_aulas
    console.log('🚀 Inserindo dados em dim_aulas...');
    const { error: errAulas } = await supabase.from('dim_aulas').upsert(aulas);
    if (errAulas) throw new Error(`Erro dim_aulas: ${errAulas.message}`);

    // 4. Popular dim_questoes
    console.log('🚀 Inserindo dados em dim_questoes...');
    const { error: errQuest } = await supabase.from('dim_questoes').upsert(questoes);
    if (errQuest) throw new Error(`Erro dim_questoes: ${errQuest.message}`);

    console.log('📊 ✅ Todas as tabelas dimensão foram preenchidas com sucesso!');
  } catch (error) {
    console.error('❌ Falha na carga dimensional:', error.message);
  }
}

semearDimensoes();