export const mockMundos = [
  { id: "comp_especifico", nome: "Componente Específico", ordem: 1 }
];

export const mockTopicos = [
  { id: "topico_seguranca", mundo_id: "comp_especifico", nome: "Segurança da Informação", ordem: 1 },
  { id: "topico_modelagem", mundo_id: "comp_especifico", nome: "Engenharia e Modelagem de Software", ordem: 2 }
];

export const mockAulasRapidas = {
  "aula_pilares_seguranca": {
    id: "aula_pilares_seguranca",
    topico_id: "topico_seguranca",
    titulo: "Os Pilares da Segurança (C.I.D.A.)",
    conteudo_markdown: "Para o ENADE, lembre-se do trio C.I.D.:\n\n* **Confidencialidade:** Proteção contra acesso não autorizado.\n* **Integridade:** Proteção contra alterações indevidas.\n* **Disponibilidade:** Acesso garantido sempre que necessário.\n\n⚠️ *Pegadinha:* A autenticidade garante a identidade do remetente, não confunda com integridade!"
  },
  "aula_modelagem_uml": {
    id: "aula_modelagem_uml",
    topico_id: "topico_modelagem",
    titulo: "Diagramas de Classes e UML",
    conteudo_markdown: "Revisão rápida de diagramas estruturais da UML:\n\n* **Associação:** Mecanismo de ligação simples entre classes.\n* **Herança/Generalização:** Representa hierarquias (Superclasse e Subclasse).\n* **Multiplicidade:** Define a quantidade de instâncias que se relacionam (ex: 1..1 ou 0..n)."
  }
};

export const mockQuestoes = [
  {
    id: "enade_2021_q25",
    topico_id: "topico_seguranca",
    aula_relacionada_id: "aula_pilares_seguranca",
    ano: 2021,
    enunciado: "Em conformidade com a ABNT NBR ISO/IEC 27002 (2013), segurança da informação ocorre por meio de práticas e processos de proteção e salvaguarda dos ativos da informação... Está amparada pelos preceitos de integridade, disponibilidade e confidencialidade.",
    afirmacoes: [
      { letra: "I", texto: "A integridade da informação tem como objetivo garantir a acessibilidade da informação." },
      { letra: "II", texto: "A disponibilidade garante que os autorizados a acessarem a informação possam fazê-lo sempre que necessário." },
      { letra: "III", texto: "A confidencialidade da informação é a garantia de que somente pessoas autorizadas terão acesso a ela, protegendo-a de acordo com o grau de sigilo do seu conteúdo." }
    ],
    alternativas: [
      { opcao: "A", texto: "I e II." },
      { opcao: "B", texto: "I e III." },
      { opcao: "C", texto: "II e III." }
    ],
    resposta_correta: "C", //
    feedback_resolucao: "Alternativa Correta: C. A afirmação I está incorreta porque acessibilidade é preceito de Disponibilidade, enquanto a Integridade protege contra alterações indevidas."
  },
  {
    id: "enade_2021_q12",
    topico_id: "topico_seguranca",
    aula_relacionada_id: "aula_pilares_seguranca",
    ano: 2021,
    enunciado: "A segurança dos dados refere-se às medidas que garantem confidencialidade, integridade e disponibilidade dos sistemas de informação. Considerando a segurança em bancos de dados, avalie as asserções:",
    afirmacoes: [
      { letra: "I", texto: "A confidencialidade dos dados é o que garante que eles estejam protegidos contra acesso não autorizado." }
    ],
    alternativas: [
      { opcao: "A", texto: "A asserção I é uma proposição verdadeira." },
      { opcao: "B", texto: "A asserção I é uma proposição falsa." }
    ],
    resposta_correta: "A", //
    feedback_resolucao: "A confidencialidade de fato garante a proteção contra o acesso não autorizado a dados sensíveis."
  },
  {
    id: "enade_2021_q09",
    topico_id: "topico_modelagem",
    aula_relacionada_id: "aula_modelagem_uml",
    ano: 2021,
    enunciado: "Um desenvolvedor esboçou o diagrama UML contendo os elementos apresentados na figura. Em relação ao que é proposto no diagrama, avalie as afirmações:",
    afirmacoes: [
      { letra: "I", texto: "O mecanismo de ligação entre as classes Segurado e Seguro é a associação." },
      { letra: "II", texto: "É permitido que um Segurado possa adquirir várias apólices de Seguro." }
    ],
    alternativas: [
      { opcao: "A", texto: "Apenas I está correta." },
      { opcao: "B", texto: "Apenas II está correta." },
      { opcao: "C", texto: "Ambas I e II estão corretas." }
    ],
    resposta_correta: "C", //
    feedback_resolucao: "Correta: C. O diagrama mostra uma associação simples e a multiplicidade 0..n indica que um segurado pode ter vários seguros."
  }
];