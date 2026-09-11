import type {
  Activity,
  ActivityDifficulty,
  ActivityLevel,
  ActivityType,
} from "@/types";

export type {
  Activity,
  ActivityDifficulty,
  ActivityLevel,
  ActivityType,
} from "@/types";

export const activities: Activity[] = [

  // ============================================================
  // 1. IDIOMAS
  // ============================================================

  {
    id: "idiomas_vocab_001",
    category: "idiomas",
    subgoal: "vocabulario",
    name: "Revisar flashcards",
    description:
      "Revise seus flashcards usando repetição espaçada, prestando atenção principalmente nas palavras que você erra.",
    result:
      "Revisar uma sessão de flashcards e identificar as palavras que ainda precisam de prática.",
    durationMin: 5,
    durationIdeal: 10,
    durationMax: 15,
    level: "todos",
    difficulty: "facil",
    type: "praticar",
    xp: 15,
    frequency: "diario",
    tags: ["vocabulario", "flashcards", "memoria", "repeticao-espacada"]
  },

  {
    id: "idiomas_vocab_002",
    category: "idiomas",
    subgoal: "vocabulario",
    name: "Aprender 10 palavras com contexto",
    description:
      "Aprenda até 10 palavras novas e veja como elas são usadas em frases reais.",
    result:
      "Aprender novas palavras e conseguir explicar pelo menos uma frase ou contexto para cada uma.",
    durationMin: 15,
    durationIdeal: 15,
    durationMax: 20,
    level: "basico",
    difficulty: "medio",
    type: "aprender",
    xp: 25,
    frequency: "3-5x-semana",
    tags: ["vocabulario", "palavras", "contexto"]
  },

  {
    id: "idiomas_listen_001",
    category: "idiomas",
    subgoal: "compreensao-auditiva",
    name: "Vídeo curto + novas palavras",
    description:
      "Assista a um vídeo curto no idioma estudado e registre algumas palavras ou expressões que você reconheceu ou descobriu.",
    result:
      "Registrar pelo menos 5 palavras ou expressões novas.",
    durationMin: 15,
    durationIdeal: 15,
    durationMax: 20,
    level: "basico",
    difficulty: "medio",
    type: "aprender",
    xp: 25,
    frequency: "3-5x-semana",
    tags: ["listening", "video", "vocabulario"]
  },

  {
    id: "idiomas_speak_001",
    category: "idiomas",
    subgoal: "fala",
    name: "Shadowing com áudio nativo",
    description:
      "Escolha um áudio curto e repita as frases em voz alta tentando acompanhar o ritmo, pronúncia e entonação.",
    result:
      "Repetir pelo menos 5 frases acompanhando o áudio.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "basico",
    difficulty: "medio",
    type: "praticar",
    xp: 25,
    frequency: "3-5x-semana",
    tags: ["fala", "pronuncia", "shadowing", "listening"]
  },

  {
    id: "idiomas_read_001",
    category: "idiomas",
    subgoal: "leitura",
    name: "Ler texto curto + resumir",
    description:
      "Leia um texto curto no idioma estudado e escreva com suas próprias palavras o que entendeu.",
    result:
      "Produzir um pequeno resumo demonstrando a compreensão do texto.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 20,
    level: "basico",
    difficulty: "medio",
    type: "praticar",
    xp: 30,
    frequency: "3-5x-semana",
    tags: ["leitura", "compreensao", "resumo"]
  },

  {
    id: "idiomas_write_001",
    category: "idiomas",
    subgoal: "escrita",
    name: "Escrever 5 frases sobre o dia",
    description:
      "Escreva cinco frases sobre o seu dia usando o idioma que está estudando.",
    result:
      "Produzir cinco frases completas no idioma estudado.",
    durationMin: 10,
    durationIdeal: 10,
    durationMax: 15,
    level: "basico",
    difficulty: "facil",
    type: "produzir",
    xp: 20,
    frequency: "diario",
    tags: ["escrita", "frases", "pratica"]
  },

  {
    id: "idiomas_speak_002",
    category: "idiomas",
    subgoal: "fala",
    name: "Conversação no idioma",
    description:
      "Converse com outra pessoa usando o idioma estudado. Priorize comunicação real em vez de tentar falar perfeitamente.",
    result:
      "Manter uma conversa durante o período disponível.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 30,
    level: "intermediario",
    difficulty: "dificil",
    type: "praticar",
    xp: 40,
    frequency: "2-4x-semana",
    tags: ["conversacao", "fala", "comunicacao"]
  },

  {
    id: "idiomas_gram_001",
    category: "idiomas",
    subgoal: "gramatica",
    name: "Estudar gramática + exercícios",
    description:
      "Escolha um único tópico gramatical, estude sua aplicação e resolva alguns exercícios.",
    result:
      "Conseguir explicar a regra estudada e completar os exercícios propostos.",
    durationMin: 20,
    durationIdeal: 25,
    durationMax: 30,
    level: "intermediario",
    difficulty: "dificil",
    type: "aprender",
    xp: 35,
    frequency: "2-3x-semana",
    tags: ["gramatica", "exercicios", "estrutura"]
  },


  // ============================================================
  // 2. LEITURA & CONHECIMENTO
  // ============================================================

  {
    id: "leitura_livro_001",
    category: "leitura",
    subgoal: "livros",
    name: "Ler 10 páginas + 3 ideias",
    description:
      "Leia algumas páginas de um livro e registre as três ideias mais importantes que encontrou.",
    result:
      "Ler as páginas propostas e registrar três ideias principais.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 25,
    level: "todos",
    difficulty: "medio",
    type: "aprender",
    xp: 30,
    frequency: "diario",
    tags: ["leitura", "livros", "retencao"]
  },

  {
    id: "leitura_artigo_001",
    category: "leitura",
    subgoal: "artigos",
    name: "Ler artigo + criar flashcards",
    description:
      "Leia um artigo ou conteúdo educativo e transforme três informações importantes em perguntas e respostas.",
    result:
      "Criar três flashcards sobre o conteúdo estudado.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "aprender",
    xp: 25,
    frequency: "3-5x-semana",
    tags: ["artigo", "conhecimento", "flashcards"]
  },

  {
    id: "leitura_video_001",
    category: "leitura",
    subgoal: "conteudo-educativo",
    name: "Conteúdo educativo + 3 insights",
    description:
      "Assista a uma aula, palestra ou vídeo educativo e registre três ideias que realmente acrescentaram algo ao seu conhecimento.",
    result:
      "Registrar três insights relevantes e compreendidos.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 25,
    level: "todos",
    difficulty: "facil",
    type: "aprender",
    xp: 30,
    frequency: "2-4x-semana",
    tags: ["video", "conhecimento", "insights"]
  },

  {
    id: "leitura_sintese_001",
    category: "leitura",
    subgoal: "sintese",
    name: "Resumir o que aprendeu",
    description:
      "Escolha algo que você estudou recentemente e explique a ideia principal com suas próprias palavras.",
    result:
      "Produzir um resumo curto e compreensível.",
    durationMin: 10,
    durationIdeal: 10,
    durationMax: 15,
    level: "intermediario",
    difficulty: "medio",
    type: "produzir",
    xp: 25,
    frequency: "3-5x-semana",
    tags: ["resumo", "sintese", "retencao"]
  },

  {
    id: "leitura_sintese_002",
    category: "leitura",
    subgoal: "retencao",
    name: "Explique o que aprendeu",
    description:
      "Explique em voz alta um conceito que você estudou como se estivesse ensinando para outra pessoa.",
    result:
      "Conseguir explicar o conceito sem simplesmente repetir o texto original.",
    durationMin: 10,
    durationIdeal: 10,
    durationMax: 15,
    level: "intermediario",
    difficulty: "medio",
    type: "praticar",
    xp: 25,
    frequency: "2-3x-semana",
    tags: ["explicacao", "ensino", "retencao"]
  },

  {
    id: "leitura_question_001",
    category: "leitura",
    subgoal: "pensamento-critico",
    name: "Faça uma pergunta sobre o que aprendeu",
    description:
      "Depois de ler ou estudar algo, crie uma pergunta que aprofunde o assunto e tente respondê-la.",
    result:
      "Criar e responder uma pergunta relevante sobre o conteúdo.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "intermediario",
    difficulty: "medio",
    type: "praticar",
    xp: 25,
    frequency: "2-3x-semana",
    tags: ["pensamento-critico", "perguntas", "aprendizado"]
  },

  {
    id: "leitura_revisao_001",
    category: "leitura",
    subgoal: "revisao",
    name: "Revisar anotações + escolher uma aplicação",
    description:
      "Revise algo que aprendeu durante a semana e identifique uma forma concreta de aplicar esse conhecimento.",
    result:
      "Registrar uma aplicação prática para um conhecimento adquirido.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "todos",
    difficulty: "facil",
    type: "organizar",
    xp: 20,
    frequency: "semanal",
    tags: ["revisao", "aplicacao", "conhecimento"]
  },


  // ============================================================
  // 3. SAÚDE FÍSICA
  // ============================================================

  {
    id: "fisica_cardio_001",
    category: "saude-fisica",
    subgoal: "cardio",
    name: "Caminhada rápida",
    description:
      "Faça uma caminhada em ritmo confortável e ativo durante o tempo disponível.",
    result:
      "Completar uma caminhada contínua durante o período escolhido.",
    durationMin: 20,
    durationIdeal: 25,
    durationMax: 30,
    level: "todos",
    difficulty: "facil",
    type: "praticar",
    xp: 25,
    frequency: "diario",
    tags: ["caminhada", "cardio", "movimento"]
  },

  {
    id: "fisica_flex_001",
    category: "saude-fisica",
    subgoal: "flexibilidade",
    name: "Alongamento",
    description:
      "Faça uma sequência simples de alongamentos, sem forçar além do seu limite confortável.",
    result:
      "Completar uma sessão curta de alongamento.",
    durationMin: 5,
    durationIdeal: 10,
    durationMax: 10,
    level: "todos",
    difficulty: "facil",
    type: "cuidar",
    xp: 15,
    frequency: "diario",
    tags: ["alongamento", "flexibilidade", "mobilidade"]
  },

  {
    id: "fisica_mobil_001",
    category: "saude-fisica",
    subgoal: "mobilidade",
    name: "Sessão de mobilidade",
    description:
      "Faça exercícios leves de mobilidade para movimentar diferentes articulações do corpo.",
    result:
      "Completar uma sessão curta de mobilidade respeitando seus limites.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "todos",
    difficulty: "medio",
    type: "praticar",
    xp: 25,
    frequency: "3-5x-semana",
    tags: ["mobilidade", "movimento", "corpo"]
  },

  {
    id: "fisica_forca_001",
    category: "saude-fisica",
    subgoal: "forca",
    name: "Exercício corporal curto",
    description:
      "Faça uma sessão curta de exercícios com o peso do próprio corpo adequada ao seu nível.",
    result:
      "Completar uma sessão de exercícios respeitando seu nível e seus limites.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "praticar",
    xp: 30,
    frequency: "3-5x-semana",
    tags: ["forca", "corpo", "exercicio"]
  },

  {
    id: "fisica_core_001",
    category: "saude-fisica",
    subgoal: "core",
    name: "Sessão curta de core",
    description:
      "Faça uma sessão curta focada na musculatura do core, adaptando os exercícios ao seu nível.",
    result:
      "Completar uma sessão curta de core com boa execução.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "todos",
    difficulty: "medio",
    type: "praticar",
    xp: 25,
    frequency: "3-5x-semana",
    tags: ["core", "abdomen", "forca"]
  },

  {
    id: "fisica_yoga_001",
    category: "saude-fisica",
    subgoal: "mobilidade",
    name: "Yoga ou mobilidade guiada",
    description:
      "Siga uma sessão curta e adequada ao seu nível, priorizando movimentos confortáveis e controlados.",
    result:
      "Completar uma sessão guiada de movimento.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "praticar",
    xp: 30,
    frequency: "3-5x-semana",
    tags: ["yoga", "mobilidade", "movimento"]
  },

  {
    id: "fisica_rotina_001",
    category: "saude-fisica",
    subgoal: "consistencia",
    name: "Revisar objetivo físico",
    description:
      "Revise seu objetivo físico atual, veja o que está funcionando e escolha um pequeno ajuste para continuar avançando.",
    result:
      "Registrar o próximo passo do seu objetivo físico.",
    durationMin: 10,
    durationIdeal: 10,
    durationMax: 15,
    level: "todos",
    difficulty: "facil",
    type: "organizar",
    xp: 20,
    frequency: "semanal",
    tags: ["objetivos", "consistencia", "planejamento"]
  },


  // ============================================================
  // 4. BEM-ESTAR
  // ============================================================

  {
    id: "bemestar_medit_001",
    category: "bem-estar",
    subgoal: "atencao",
    name: "Meditação guiada",
    description:
      "Faça uma sessão curta de meditação guiada, mantendo a atenção na prática e retornando a ela quando se distrair.",
    result:
      "Completar a sessão de meditação escolhida.",
    durationMin: 5,
    durationIdeal: 10,
    durationMax: 15,
    level: "todos",
    difficulty: "facil",
    type: "praticar",
    xp: 25,
    frequency: "diario",
    tags: ["meditacao", "atencao", "presenca"]
  },

  {
    id: "bemestar_resp_001",
    category: "bem-estar",
    subgoal: "respiracao",
    name: "Exercício de respiração",
    description:
      "Faça uma prática curta de respiração guiada, mantendo atenção no ritmo da respiração.",
    result:
      "Completar uma sessão de respiração consciente.",
    durationMin: 5,
    durationIdeal: 5,
    durationMax: 10,
    level: "todos",
    difficulty: "facil",
    type: "praticar",
    xp: 20,
    frequency: "diario",
    tags: ["respiracao", "atencao", "relaxamento"]
  },

  {
    id: "bemestar_journal_001",
    category: "bem-estar",
    subgoal: "autoconhecimento",
    name: "Diário: feito, desafio e aprendizado",
    description:
      "Registre uma coisa que fez bem, um desafio enfrentado e algo que aprendeu durante o dia.",
    result:
      "Registrar os três pontos do dia.",
    durationMin: 10,
    durationIdeal: 10,
    durationMax: 15,
    level: "todos",
    difficulty: "medio",
    type: "produzir",
    xp: 25,
    frequency: "diario",
    tags: ["journal", "reflexao", "autoconhecimento"]
  },

  {
    id: "bemestar_journal_002",
    category: "bem-estar",
    subgoal: "autoconhecimento",
    name: "Transformar preocupações em ações",
    description:
      "Escreva até três preocupações atuais e, para cada uma, identifique uma pequena ação possível.",
    result:
      "Transformar pelo menos uma preocupação em um próximo passo concreto.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "intermediario",
    difficulty: "medio",
    type: "produzir",
    xp: 25,
    frequency: "3-5x-semana",
    tags: ["reflexao", "problemas", "acao"]
  },

  {
    id: "bemestar_grat_001",
    category: "bem-estar",
    subgoal: "reflexao",
    name: "Registrar 3 coisas positivas",
    description:
      "Registre três coisas específicas pelas quais você é grato ou que foram positivas no seu dia.",
    result:
      "Registrar três acontecimentos ou aspectos específicos.",
    durationMin: 5,
    durationIdeal: 5,
    durationMax: 10,
    level: "todos",
    difficulty: "facil",
    type: "produzir",
    xp: 20,
    frequency: "diario",
    tags: ["gratidao", "reflexao", "positivo"]
  },

  {
    id: "bemestar_relax_001",
    category: "bem-estar",
    subgoal: "relaxamento",
    name: "Body scan ou relaxamento",
    description:
      "Faça uma prática curta de atenção ao corpo e relaxamento, observando as sensações sem tentar forçá-las.",
    result:
      "Completar uma sessão curta de relaxamento consciente.",
    durationMin: 10,
    durationIdeal: 10,
    durationMax: 15,
    level: "todos",
    difficulty: "facil",
    type: "cuidar",
    xp: 25,
    frequency: "diario",
    tags: ["relaxamento", "corpo", "atencao"]
  },

  {
    id: "bemestar_rotina_001",
    category: "bem-estar",
    subgoal: "rotina",
    name: "Criar ritual noturno",
    description:
      "Defina três ações simples para repetir antes de dormir e experimente executá-las hoje.",
    result:
      "Definir e executar três ações para o ritual noturno.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 25,
    frequency: "uma-vez + diario",
    tags: ["rotina", "sono", "habitos"]
  },


  // ============================================================
  // 5. FINANÇAS
  // ============================================================

  {
    id: "financas_controle_001",
    category: "financas",
    subgoal: "controle",
    name: "Registrar gastos",
    description:
      "Registre os gastos realizados recentemente em uma planilha ou aplicativo de controle financeiro.",
    result:
      "Registrar todos os gastos do período escolhido.",
    durationMin: 5,
    durationIdeal: 5,
    durationMax: 10,
    level: "todos",
    difficulty: "facil",
    type: "organizar",
    xp: 15,
    frequency: "diario",
    tags: ["gastos", "controle", "organizacao"]
  },

  {
    id: "financas_controle_002",
    category: "financas",
    subgoal: "controle",
    name: "Encontrar 3 gastos evitáveis",
    description:
      "Revise seus gastos recentes e identifique três despesas que poderiam ser reduzidas ou evitadas.",
    result:
      "Identificar três gastos e uma possível mudança para cada um.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 25,
    frequency: "semanal",
    tags: ["gastos", "economia", "analise"]
  },

  {
    id: "financas_orca_001",
    category: "financas",
    subgoal: "orcamento",
    name: "Revisar orçamento",
    description:
      "Revise seu orçamento atual, compare o planejado com o realizado e faça os ajustes necessários.",
    result:
      "Atualizar o orçamento e definir pelo menos um ajuste.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 30,
    frequency: "semanal",
    tags: ["orcamento", "planejamento", "dinheiro"]
  },

  {
    id: "financas_orca_002",
    category: "financas",
    subgoal: "organizacao",
    name: "Separar gastos fixos e variáveis",
    description:
      "Liste seus principais gastos e classifique-os entre fixos e variáveis.",
    result:
      "Ter uma visão clara dos principais gastos fixos e variáveis.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 30,
    frequency: "mensal",
    tags: ["gastos", "organizacao", "orcamento"]
  },

  {
    id: "financas_edu_001",
    category: "financas",
    subgoal: "educacao",
    name: "Estudar um conceito financeiro",
    description:
      "Escolha um conceito financeiro e estude-o por alguns minutos. Depois registre uma aplicação prática.",
    result:
      "Entender um conceito e registrar uma forma de aplicá-lo.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 25,
    level: "todos",
    difficulty: "facil",
    type: "aprender",
    xp: 30,
    frequency: "2-4x-semana",
    tags: ["educacao-financeira", "aprendizado", "dinheiro"]
  },

  {
    id: "financas_invest_001",
    category: "financas",
    subgoal: "patrimonio",
    name: "Calcular patrimônio líquido",
    description:
      "Liste seus principais ativos e obrigações e calcule a diferença entre eles.",
    result:
      "Obter uma estimativa atualizada do patrimônio líquido.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 30,
    frequency: "mensal",
    tags: ["patrimonio", "organizacao", "financas"]
  },

  {
    id: "financas_meta_001",
    category: "financas",
    subgoal: "economia",
    name: "Definir meta de economia",
    description:
      "Escolha um valor ou percentual realista para economizar e defina o próximo passo para chegar lá.",
    result:
      "Registrar uma meta financeira clara e um próximo passo.",
    durationMin: 15,
    durationIdeal: 15,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 30,
    frequency: "mensal",
    tags: ["economia", "meta", "planejamento"]
  },


  // ============================================================
  // 6. CARREIRA
  // ============================================================

  {
    id: "carreira_comun_001",
    category: "carreira",
    subgoal: "comunicacao",
    name: "Praticar apresentação",
    description:
      "Escolha um assunto profissional e explique-o em voz alta. Grave se quiser ouvir depois.",
    result:
      "Fazer uma apresentação curta e clara sem depender de leitura integral.",
    durationMin: 10,
    durationIdeal: 10,
    durationMax: 15,
    level: "todos",
    difficulty: "medio",
    type: "praticar",
    xp: 30,
    frequency: "2-3x-semana",
    tags: ["comunicacao", "apresentacao", "fala"]
  },

  {
    id: "carreira_comun_002",
    category: "carreira",
    subgoal: "entrevista",
    name: "Treinar resposta de entrevista",
    description:
      "Escolha uma pergunta comum de entrevista e formule uma resposta objetiva usando exemplos reais.",
    result:
      "Produzir e praticar uma resposta completa.",
    durationMin: 15,
    durationIdeal: 15,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "praticar",
    xp: 30,
    frequency: "1-2x-semana",
    tags: ["entrevista", "carreira", "comunicacao"]
  },

  {
    id: "carreira_comun_003",
    category: "carreira",
    subgoal: "comunicacao",
    name: "Revisar comunicação profissional",
    description:
      "Escreva ou revise uma mensagem profissional importante antes de enviá-la.",
    result:
      "Ter uma comunicação mais clara, objetiva e adequada ao contexto.",
    durationMin: 15,
    durationIdeal: 15,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "produzir",
    xp: 30,
    frequency: "quando-necessario",
    tags: ["email", "comunicacao", "profissional"]
  },

  {
    id: "carreira_aprend_001",
    category: "carreira",
    subgoal: "habilidades",
    name: "Estudar uma habilidade profissional",
    description:
      "Escolha uma habilidade relevante para sua carreira e dedique um período curto para estudá-la.",
    result:
      "Aprender um conceito aplicável à sua área e registrar uma forma de praticá-lo.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 30,
    level: "todos",
    difficulty: "medio",
    type: "aprender",
    xp: 30,
    frequency: "2-3x-semana",
    tags: ["habilidades", "carreira", "aprendizado"]
  },

  {
    id: "carreira_network_001",
    category: "carreira",
    subgoal: "networking",
    name: "Atualizar uma conquista profissional",
    description:
      "Registre uma conquista, projeto ou habilidade recente em seu perfil profissional ou currículo.",
    result:
      "Registrar pelo menos uma conquista profissional relevante.",
    durationMin: 10,
    durationIdeal: 10,
    durationMax: 15,
    level: "todos",
    difficulty: "facil",
    type: "produzir",
    xp: 20,
    frequency: "semanal",
    tags: ["curriculo", "linkedin", "conquistas"]
  },

  {
    id: "carreira_network_002",
    category: "carreira",
    subgoal: "networking",
    name: "Retomar contato profissional",
    description:
      "Entre em contato com uma pessoa que pode fazer parte da sua rede profissional. Seja genuíno e objetivo.",
    result:
      "Enviar uma mensagem profissional para uma pessoa relevante.",
    durationMin: 5,
    durationIdeal: 10,
    durationMax: 10,
    level: "todos",
    difficulty: "medio",
    type: "produzir",
    xp: 20,
    frequency: "1-2x-semana",
    tags: ["networking", "contatos", "carreira"]
  },

  {
    id: "carreira_planej_001",
    category: "carreira",
    subgoal: "planejamento",
    name: "Revisar objetivo profissional",
    description:
      "Revise onde você quer chegar profissionalmente, avalie seu progresso e defina o próximo passo.",
    result:
      "Registrar um próximo passo concreto para seu objetivo profissional.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 30,
    frequency: "mensal",
    tags: ["objetivos", "carreira", "planejamento"]
  },


  // ============================================================
  // 7. TECNOLOGIA
  // ============================================================

  {
    id: "tec_prog_001",
    category: "tecnologia",
    subgoal: "programacao",
    name: "Resolver exercício de programação",
    description:
      "Resolva um ou dois exercícios adequados ao seu nível, priorizando raciocínio e compreensão.",
    result:
      "Resolver pelo menos um exercício e entender a solução.",
    durationMin: 20,
    durationIdeal: 25,
    durationMax: 30,
    level: "intermediario",
    difficulty: "dificil",
    type: "praticar",
    xp: 40,
    frequency: "3-5x-semana",
    tags: ["programacao", "logica", "exercicios"]
  },

  {
    id: "tec_prog_002",
    category: "tecnologia",
    subgoal: "documentacao",
    name: "Ler documentação + aplicar",
    description:
      "Escolha uma função, recurso ou conceito da documentação oficial de uma tecnologia que você usa e aplique-o.",
    result:
      "Usar corretamente pelo menos um recurso estudado.",
    durationMin: 20,
    durationIdeal: 25,
    durationMax: 30,
    level: "intermediario",
    difficulty: "dificil",
    type: "aprender",
    xp: 35,
    frequency: "2-4x-semana",
    tags: ["documentacao", "programacao", "pratica"]
  },

  {
    id: "tec_prog_003",
    category: "tecnologia",
    subgoal: "projeto",
    name: "Melhorar seu próprio código",
    description:
      "Escolha uma parte pequena do seu projeto e melhore sua clareza, organização ou implementação.",
    result:
      "Concluir uma melhoria concreta no código.",
    durationMin: 20,
    durationIdeal: 25,
    durationMax: 30,
    level: "intermediario",
    difficulty: "dificil",
    type: "produzir",
    xp: 35,
    frequency: "2-3x-semana",
    tags: ["codigo", "refatoracao", "projeto"]
  },

  {
    id: "tec_ia_001",
    category: "tecnologia",
    subgoal: "inteligencia-artificial",
    name: "Usar IA para uma tarefa real",
    description:
      "Escolha uma tarefa real e experimente usar uma ferramenta de IA para resolvê-la ou melhorá-la.",
    result:
      "Concluir uma tarefa real usando IA e avaliar o resultado.",
    durationMin: 15,
    durationIdeal: 20,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "praticar",
    xp: 30,
    frequency: "diario",
    tags: ["ia", "produtividade", "pratica"]
  },

  {
    id: "tec_ferramenta_001",
    category: "tecnologia",
    subgoal: "ferramentas",
    name: "Aprender um recurso novo",
    description:
      "Escolha um recurso, atalho ou funcionalidade de uma ferramenta que você utiliza e aprenda a usá-lo.",
    result:
      "Aprender e utilizar pelo menos um recurso novo.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "todos",
    difficulty: "facil",
    type: "aprender",
    xp: 25,
    frequency: "2-3x-semana",
    tags: ["ferramentas", "atalhos", "produtividade"]
  },

  {
    id: "tec_dados_001",
    category: "tecnologia",
    subgoal: "dados",
    name: "Praticar SQL ou lógica",
    description:
      "Resolva alguns exercícios curtos de SQL, lógica ou manipulação de dados adequados ao seu nível.",
    result:
      "Resolver pelo menos um exercício e compreender a solução.",
    durationMin: 20,
    durationIdeal: 25,
    durationMax: 30,
    level: "intermediario",
    difficulty: "dificil",
    type: "praticar",
    xp: 35,
    frequency: "3-5x-semana",
    tags: ["sql", "dados", "logica"]
  },

  {
    id: "tec_projeto_001",
    category: "tecnologia",
    subgoal: "projetos",
    name: "Trabalhar no próprio projeto",
    description:
      "Escolha uma pequena parte do seu projeto e trabalhe nela durante o período disponível.",
    result:
      "Produzir uma melhoria ou avanço concreto no projeto.",
    durationMin: 30,
    durationIdeal: 45,
    durationMax: 60,
    level: "intermediario",
    difficulty: "dificil",
    type: "produzir",
    xp: 50,
    frequency: "2-4x-semana",
    tags: ["projeto", "programacao", "construcao"]
  },


  // ============================================================
  // 8. ORGANIZAÇÃO & PRODUTIVIDADE
  // ============================================================

  {
    id: "org_planej_001",
    category: "organizacao",
    subgoal: "planejamento",
    name: "Planejar 3 prioridades",
    description:
      "Defina as três prioridades mais importantes para o próximo dia. Seja específico sobre o que precisa ser feito.",
    result:
      "Ter três prioridades claras para o próximo dia.",
    durationMin: 5,
    durationIdeal: 5,
    durationMax: 10,
    level: "todos",
    difficulty: "facil",
    type: "organizar",
    xp: 20,
    frequency: "diario",
    tags: ["planejamento", "prioridades", "foco"]
  },

  {
    id: "org_planej_002",
    category: "organizacao",
    subgoal: "planejamento",
    name: "Revisar tarefas e prioridades",
    description:
      "Revise suas tarefas, identifique o que foi concluído, o que ficou pendente e o que realmente importa agora.",
    result:
      "Ter uma lista de tarefas atualizada e priorizada.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 25,
    frequency: "semanal",
    tags: ["tarefas", "prioridades", "revisao"]
  },

  {
    id: "org_tarefa_001",
    category: "organizacao",
    subgoal: "tarefas",
    name: "Processar lista de tarefas",
    description:
      "Revise sua lista e decida o que fazer, agendar, delegar ou remover.",
    result:
      "Reduzir a lista e deixar cada tarefa com uma decisão clara.",
    durationMin: 10,
    durationIdeal: 15,
    durationMax: 15,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 25,
    frequency: "2-3x-semana",
    tags: ["tarefas", "organizacao", "decisao"]
  },

  {
    id: "org_limpeza_001",
    category: "organizacao",
    subgoal: "ambiente",
    name: "Organizar espaço de trabalho",
    description:
      "Escolha uma área pequena do seu espaço de trabalho e deixe-a limpa e funcional.",
    result:
      "Ter um espaço de trabalho mais organizado.",
    durationMin: 10,
    durationIdeal: 10,
    durationMax: 15,
    level: "todos",
    difficulty: "facil",
    type: "cuidar",
    xp: 20,
    frequency: "2-3x-semana",
    tags: ["organizacao", "ambiente", "limpeza"]
  },

  {
    id: "org_limpeza_002",
    category: "organizacao",
    subgoal: "organizacao-digital",
    name: "Organizar arquivos digitais",
    description:
      "Escolha uma única pasta ou área digital e organize seus arquivos, removendo o que não é mais necessário.",
    result:
      "Deixar uma área digital organizada e sem arquivos inúteis.",
    durationMin: 15,
    durationIdeal: 15,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 25,
    frequency: "semanal",
    tags: ["arquivos", "digital", "organizacao"]
  },

  {
    id: "org_foco_001",
    category: "organizacao",
    subgoal: "foco",
    name: "Bloco de foco de 25 minutos",
    description:
      "Escolha uma única tarefa e trabalhe nela durante 25 minutos sem interrupções desnecessárias.",
    result:
      "Completar um bloco de 25 minutos de trabalho focado.",
    durationMin: 25,
    durationIdeal: 25,
    durationMax: 30,
    level: "todos",
    difficulty: "medio",
    type: "praticar",
    xp: 35,
    frequency: "diario",
    tags: ["foco", "pomodoro", "concentracao"]
  },

  {
    id: "org_foco_002",
    category: "organizacao",
    subgoal: "distrações",
    name: "Remover uma distração",
    description:
      "Identifique uma distração frequente e tome uma ação concreta para removê-la durante seu próximo período de foco.",
    result:
      "Eliminar ou reduzir uma distração específica.",
    durationMin: 5,
    durationIdeal: 5,
    durationMax: 10,
    level: "todos",
    difficulty: "facil",
    type: "organizar",
    xp: 20,
    frequency: "quando-necessario",
    tags: ["distração", "foco", "ambiente"]
  },

  {
    id: "org_meta_001",
    category: "organizacao",
    subgoal: "metas",
    name: "Revisar metas e progresso",
    description:
      "Revise uma meta importante, veja o que avançou e defina o próximo passo concreto.",
    result:
      "Registrar o progresso e definir um próximo passo.",
    durationMin: 15,
    durationIdeal: 15,
    durationMax: 20,
    level: "todos",
    difficulty: "medio",
    type: "organizar",
    xp: 30,
    frequency: "mensal",
    tags: ["metas", "progresso", "planejamento"]
  }

];