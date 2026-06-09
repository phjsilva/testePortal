// Dados mockados usados enquanto a API de materiais não está implementada
(function () {
    window.studyModules = [
        {
            id: 1,
            title: "Fundamentos das Metodologias Ágeis",
            subtitle: "Histórico, Manifesto Ágil e Princípios de Entrega Incremental",
            description: "Compreenda as bases que fundamentam os métodos ágeis, incluindo a crise do software, o manifesto e seus valores estruturais.",
            introduction: "Este módulo apresenta os motivos históricos que levaram à criação das metodologias ágeis e explica a filosofia do Manifesto Ágil de 2001, que prioriza colaboração, entrega frequente e adaptação sobre burocracias e processos rígidos.",
            contents: [
                {
                    title: "1. Introdução",
                    paragraphs: [
                        "Durante as décadas de 1970 a 1990, a engenharia de software foi marcada pela 'crise do software'. Projetos frequentemente estouravam prazos, superavam orçamentos planejados e entregavam sistemas que não atendiam às necessidades reais dos usuários.",
                        "A causa desse problema estava fortemente associada aos modelos tradicionais lineares (como o Cascata), que exigiam um planejamento inicial exaustivo e congelamento de requisitos. Diante disso, surgiu a necessidade de abordagens mais adaptativas e dinâmicas."
                    ]
                },
                {
                    title: "2. Conceitos Fundamentais",
                    paragraphs: [
                        "A agilidade baseia-se no ciclo de desenvolvimento iterativo e incremental, contrapondo-se ao modelo sequencial Cascata."
                    ],
                    topics: [
                        "Iteração: Ciclos curtos de trabalho que geram partes utilizáveis do produto, permitindo obter feedback rápido.",
                        "Incremental: O produto é construído parte por parte, onde cada incremento adiciona valor real e funcionalidade.",
                        "Desenvolvimento Ágil: Foca na entrega contínua de valor, na comunicação direta e na capacidade de responder rapidamente a mudanças de requisitos."
                    ]
                },
                {
                    title: "3. Pontos Mais Cobrados",
                    paragraphs: [
                        "Nas avaliações e exames da funcionalidade, os temas mais recorrentes focam nos pilares do Manifesto Ágil e em suas definições fundamentais:"
                    ],
                    topics: [
                        "Manifesto Ágil (2001): Documento histórico que define os 4 valores e 12 princípios do desenvolvimento ágil.",
                        "Valores fundamentais: Indivíduos e interações mais que processos e ferramentas; Software em funcionamento mais que documentação abrangente; Colaboração com o cliente mais que negociação de contratos; Responder a mudanças mais que seguir um plano.",
                        "Software funcionando: A principal medida de progresso de um projeto ágil, refletindo a entrega de utilidade real ao usuário."
                    ]
                },
                {
                    title: "4. Erros Mais Comuns",
                    paragraphs: [
                        "Um equívoco frequente das equipes é acreditar que a agilidade elimina o planejamento ou a documentação técnica. O planejamento no Scrum é contínuo e colaborativo, e a documentação necessária é produzida de forma enxuta.",
                        "Outro erro comum é tentar evitar ou rejeitar mudanças de requisitos após o início do projeto, o que vai totalmente contra a postura ágil de enxergar mudanças como oportunidades de agregar valor ao produto final."
                    ]
                },
                {
                    title: "5. Resumo Estratégico",
                    paragraphs: [
                        "A agilidade substitui o controle rígido por processos adaptativos baseados em ciclos frequentes de inspeção e adaptação."
                    ],
                    summary: "Lembre-se: As metodologias ágeis (como Scrum, Kanban e XP) são mais adequadas para projetos com alto grau de incerteza e requisitos mutáveis, onde o cliente atua de forma constante como um parceiro ativo no desenvolvimento."
                },
                {
                    title: "6. Dicas para a Prova",
                    paragraphs: [
                        "Foque na memorização da principal medida de progresso (software funcionando) e na correta interpretação dos valores do Manifesto Ágil:"
                    ],
                    topics: [
                        "A chamada 'crise do software' decorria fundamentalmente da rigidez e dificuldade de lidar com mudanças frequentes de requisitos.",
                        "Equipes auto-organizadas possuem autonomia para decidir internamente como executar o trabalho planejado, em vez de receberem ordens de gerentes.",
                        "A agilidade foca na priorização de interações e entrega de valor, sem ignorar por completo a necessidade de planos e documentação."
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "Scrum: Estrutura, Papéis e Artefatos",
            subtitle: "Pilares do Empirismo, Responsabilidades do Time e Artefatos com seus Compromissos",
            description: "Entenda a estrutura básica do framework Scrum, as accountabilities do Scrum Team e como os artefatos garantem transparência.",
            introduction: "Este módulo detalha o framework Scrum. Você aprenderá sobre os pilares empíricos (transparência, inspeção e adaptação), as responsabilidades do time (Product Owner, Scrum Master e Developers) e os três artefatos oficiais com seus respectivos compromissos.",
            contents: [
                {
                    title: "1. Introdução",
                    paragraphs: [
                        "O Scrum é um framework leve projetado para ajudar pessoas, times e organizações a gerarem valor em ambientes complexos por meio de soluções adaptativas.",
                        "Ele não descreve detalhadamente todas as práticas de engenharia de software; em vez disso, fornece uma estrutura baseada em empirismo e auto-organização."
                    ]
                },
                {
                    title: "2. Conceitos Fundamentais",
                    paragraphs: [
                        "A base teórica do Scrum apoia-se no empirismo (o conhecimento vem da experiência e de decisões baseadas no que é observado) e no pensamento enxuto (redução de desperdícios)."
                    ],
                    topics: [
                        "Transparência: Aspectos importantes do processo devem estar visíveis e compreensíveis para todos os responsáveis pelos resultados.",
                        "Inspeção: O progresso rumo ao objetivo deve ser verificado frequentemente para detectar desvios ou problemas.",
                        "Adaptação: Ajustes imediatos devem ser realizados caso o processo ou produto saia das margens aceitáveis de aceitação.",
                        "Scrum Team: Unidade fundamental do Scrum, composta por um PO, um SM e Developers. É pequeno (geralmente até 10 pessoas), multifuncional e auto-organizado."
                    ]
                },
                {
                    title: "3. Pontos Mais Cobrados",
                    paragraphs: [
                        "Os exames testam com frequência a correta distribuição de responsabilidades e a relação unívoca de cada artefato com seu compromisso:"
                    ],
                    topics: [
                        "Product Owner (PO): Responsável por maximizar o valor do produto e gerenciar/ordenar o Product Backlog (Compromisso: Product Goal).",
                        "Scrum Master (SM): Responsável por garantir a eficácia do framework, servindo como líder que atende, facilitador e removedor de impedimentos.",
                        "Developers: Comprometidos em planejar o trabalho diário da Sprint, manter a qualidade pela DoD e criar incrementos utilizáveis (Compromisso: Definition of Done).",
                        "Sprint Backlog: Contém o Sprint Goal (compromisso), os itens selecionados do Product Backlog e o plano para entregá-los."
                    ]
                },
                {
                    title: "4. Erros Mais Comuns",
                    paragraphs: [
                        "Tratar o Scrum Master como um gerente de projetos tradicional que distribui tarefas ou cobra relatórios individuais de produtividade. O Scrum Master apoia a auto-organização e protege o time.",
                        "Permitir que itens que não atendem à Definition of Done (DoD) sejam considerados concluídos ou demonstrados na Sprint Review. Se não atende à DoD, o trabalho não pode ser classificado como um Incremento utilizável.",
                        "Alterar a Definition of Done durante a Sprint sem alinhamento geral do Scrum Team, visando aprovar itens incompletos de qualidade questionável."
                    ]
                },
                {
                    title: "5. Resumo Estratégico",
                    paragraphs: [
                        "A qualidade no Scrum é protegida pela Definition of Done, e a responsabilidade por sua conformidade é compartilhada por todo o time Scrum, cabendo a execução direta aos Developers."
                    ],
                    summary: "Apenas o Product Owner tem a autoridade para cancelar uma Sprint, e isso só deve ser feito se o objetivo da Sprint (Sprint Goal) se tornar completamente obsoleto diante de mudanças de mercado ou estratégia."
                },
                {
                    title: "6. Dicas para a Prova",
                    paragraphs: [
                        "Fique extremamente atento às associações oficiais estabelecidas no Scrum Guide e na base de questões do sistema:"
                    ],
                    topics: [
                        "Product Backlog tem como compromisso o Product Goal.",
                        "Sprint Backlog tem como compromisso o Sprint Goal.",
                        "O Incremento tem como compromisso a Definition of Done (DoD).",
                        "A ausência ou indisponibilidade do PO compromete diretamente a transparência e a maximização de valor do backlog do produto.",
                        "O Scrum não define cargos formais ou hierarquias (como testador ou analista); todos os membros técnicos são Developers para incentivar a colaboração multifuncional."
                    ]
                }
            ]
        },
        {
            id: 3,
            title: "Eventos do Scrum e Fluxo de Trabalho",
            subtitle: "Sprint, Reuniões de Alinhamento, Revisão e Melhoria Contínua",
            description: "Aprenda a dinâmica do fluxo de trabalho do Scrum e os objetivos e restrições de cada um dos eventos oficiais.",
            introduction: "Este módulo cobre os cinco eventos oficiais do Scrum: a Sprint (que serve de container para todos os outros) e os quatro eventos de inspeção e adaptação (Planning, Daily, Review e Retrospective).",
            contents: [
                {
                    title: "1. Introdução",
                    paragraphs: [
                        "Os eventos no Scrum são projetados para criar cadência, previsibilidade e regularidade, minimizando drasticamente a necessidade de reuniões não definidas no framework.",
                        "Todos os eventos oficiais do Scrum possuem um limite de tempo (time-box) máximo e rigoroso para garantir foco, disciplina e eficiência."
                    ]
                },
                {
                    title: "2. Conceitos Fundamentais",
                    paragraphs: [
                        "Cada evento atua como uma oportunidade formal de inspeção e adaptação dos artefatos do Scrum:"
                    ],
                    topics: [
                        "Sprint: O container para todos os outros eventos, com duração fixa de até um mês. Uma nova Sprint começa imediatamente após a anterior.",
                        "Sprint Planning: Planejamento que define o porquê a Sprint é valiosa (Sprint Goal), o que será feito e como o trabalho será executado.",
                        "Daily Scrum: Reunião diária de 15 minutos dos Developers para inspecionar o progresso e planejar as próximas 24 horas.",
                        "Sprint Review: Inspeção do incremento com os interessados no final da Sprint para obter feedback e atualizar o Product Backlog.",
                        "Sprint Retrospective: Reunião de encerramento da Sprint para inspecionar a equipe e planejar melhorias no processo."
                    ]
                },
                {
                    title: "3. Pontos Mais Cobrados",
                    paragraphs: [
                        "Os exames cobram com grande frequência a finalidade específica e as regras de cada cerimônia:"
                    ],
                    topics: [
                        "Daily Scrum: Destinada exclusivamente aos Developers para inspecionar o progresso rumo ao Sprint Goal. Não é uma reunião de status para o PO ou gerência.",
                        "Sprint Review: Foco no produto e no valor. Coleta feedback dos stakeholders e adapta o Product Backlog para a próxima Sprint.",
                        "Sprint Retrospective: Foco no processo, pessoas, colaboração e ferramentas. O time discute melhorias e cria um plano de ação imediato.",
                        "Time-boxes (máximos): Sprint (até 1 mês), Planning (8h), Daily (15 min), Review (4h), Retrospective (3h). Os tempos são proporcionais a uma Sprint de 1 mês."
                    ]
                },
                {
                    title: "4. Erros Mais Comuns",
                    paragraphs: [
                        "Usar a Daily Scrum para solucionar ou discutir detalhadamente problemas técnicos complexos. Os desvios ou impedimentos devem ser identificados, mas as discussões longas devem ocorrer após o fim dos 15 minutos do evento.",
                        "Ignorar ou cancelar a Retrospective sob a justificativa de estar sem tempo. A Retrospective é a principal ferramenta de melhoria contínua; sem ela, o time repete falhas sistematicamente.",
                        "Transformar a Sprint Review em uma mera demonstração unilateral e formal, sem diálogo real com o cliente ou partes interessadas."
                    ]
                },
                {
                    title: "5. Resumo Estratégico",
                    paragraphs: [
                        "Os eventos são as engrenagens que garantem a transparência, inspeção e adaptação empíricas recomendadas no framework."
                    ],
                    summary: "Lembre-se: O Sprint Goal orienta e dá coerência ao trabalho da equipe. Se durante a Sprint for necessário ajustar o plano de tarefas, os Developers podem fazê-lo livremente, contanto que o Sprint Goal acordado não seja comprometido."
                },
                {
                    title: "6. Dicas para a Prova",
                    paragraphs: [
                        "Fixe a ordem cronológica correta e os participantes obrigatórios de cada evento:"
                    ],
                    topics: [
                        "A Retrospective encerra formalmente a Sprint e ocorre obrigatoriamente após a Review e antes do Planning da próxima Sprint.",
                        "A Daily Scrum deve ocorrer todos os dias no mesmo horário e local para reduzir a complexidade.",
                        "Quando a Daily Scrum é desviada de seu objetivo de adaptação do plano diário, ela perde sua eficácia ágil.",
                        "Se o Sprint Goal se torna obsoleto, a Sprint pode ser cancelada antes do término exclusivamente pelo Product Owner."
                    ]
                }
            ]
        },
        {
            id: 4,
            title: "Práticas Ágeis, Métricas e Qualidade",
            subtitle: "Kanban, Fluxo de Trabalho, Métricas e Prevenção de Dívida Técnica",
            description: "Conheça as melhores práticas de engenharia ágil e como medir a eficiência do fluxo de trabalho sem comprometer a qualidade.",
            introduction: "Este módulo aborda a integração de práticas de qualidade técnica no ciclo ágil, o uso do método Kanban para gestão visual, limites de WIP e a interpretação de métricas de fluxo como Lead Time e Velocity.",
            contents: [
                {
                    title: "1. Introdução",
                    paragraphs: [
                        "A agilidade organizacional requer excelência técnica. Sem práticas modernas de desenvolvimento e controle de fluxo, as equipes acumulam dívidas técnicas que reduzem drasticamente sua velocidade e qualidade.",
                        "O uso combinado de frameworks como Scrum e práticas adicionais (Kanban, XP) ajuda a sustentar entregas constantes e previsíveis."
                    ]
                },
                {
                    title: "2. Conceitos Fundamentais",
                    paragraphs: [
                        "A engenharia ágil apoia-se em conceitos técnicos de automação e melhoria da qualidade interna do código:"
                    ],
                    topics: [
                        "Integração Contínua (CI): Prática de integrar e testar o código frequentemente (várias vezes ao dia) para identificar bugs precocemente de forma automatizada.",
                        "Entrega Contínua (CD): Automatizar o processo de deploy para que o software possa ser colocado em produção de forma rápida e segura.",
                        "Refatoração: Modificar a estrutura interna do código para torná-lo mais limpo, eficiente e legível sem alterar seu comportamento externo.",
                        "Dívida Técnica: O custo futuro gerado por escolher soluções rápidas e improvisadas em vez de boas práticas de arquitetura."
                    ]
                },
                {
                    title: "3. Pontos Mais Cobrados",
                    paragraphs: [
                        "As questões de exames focam na gestão visual do fluxo Kanban, na identificação de gargalos e na interpretação correta de métricas:"
                    ],
                    topics: [
                        "Kanban: Abordagem que enfatiza a visualização do fluxo contínuo de trabalho e a identificação de gargalos (etapas que acumulam tarefas acumuladas).",
                        "Limites de WIP (Work In Progress): Limitar a quantidade de trabalho em andamento para evitar sobrecargas e acelerar o fluxo de entrega de ponta a ponta.",
                        "Lead Time: O tempo total decorrido desde a solicitação do item (pedido) até a sua entrega final.",
                        "Cycle Time: O tempo gasto especificamente na fase ativa de execução/desenvolvimento de uma tarefa.",
                        "Velocity: Quantidade de esforço/trabalho que o time entrega por ciclo (usado para previsões internas do próprio time, nunca para comparar equipes)."
                    ]
                },
                {
                    title: "4. Erros Mais Comuns",
                    paragraphs: [
                        "Comparar o Velocity de equipes diferentes para avaliar desempenho. O Velocity depende da estimativa de cada time e de seu contexto particular. Fazer essa comparação distorce os dados e causa perda de confiança.",
                        "Ignorar gargalos ou burlar limites de WIP adicionando mais tarefas à coluna 'Em Desenvolvimento' quando há acúmulo na coluna de 'Testes'. Isso gera filas e atrasos sistemáticos.",
                        "Adiar refatorações continuamente, acumulando dívida técnica e diminuindo a velocidade de entrega futura da equipe."
                    ]
                },
                {
                    title: "5. Resumo Estratégico",
                    paragraphs: [
                        "Para manter a qualidade e o progresso contínuos, os times devem embutir testes automatizados e refatoração em seu fluxo de trabalho diário, impedindo a degradação da Definition of Done."
                    ],
                    summary: "Gráficos de fluxo: Burndown Chart mostra o trabalho restante ao longo do tempo (excelente para acompanhar progresso na Sprint). Burnup Chart mostra o progresso acumulado do trabalho concluído (excelente para acompanhar releases)."
                },
                {
                    title: "6. Dicas para a Prova",
                    paragraphs: [
                        "Foque na diferença conceitual das métricas de fluxo e nos gráficos ágeis:"
                    ],
                    topics: [
                        "Lead Time inclui o tempo em filas de espera; Cycle Time mede apenas a fase ativa de trabalho.",
                        "A dívida técnica traz retrabalho futuro e atrasa entregas. A refatoração ajuda a contê-la.",
                        "A ausência de testes automatizados em um ambiente de integração contínua tende a aumentar falhas e retrabalhos.",
                        "Gargalos no fluxo Kanban são identificados visualmente por colunas que acumulam muitos cartões sem limites de WIP definidos."
                    ]
                }
            ]
        },
        {
            id: 5,
            title: "Aplicação Prática, Cenários e Análise Crítica",
            subtitle: "Resolução de Problemas, User Stories, Estimativas e Gestão de Riscos",
            description: "Desenvolva a capacidade de analisar cenários reais de projetos ágeis e propor soluções alinhadas à agilidade genuína.",
            introduction: "Este módulo consolida a teoria por meio de cenários de aplicação prática. Cobre a escrita de User Stories, critérios de aceitação, dinâmicas de estimativa e como responder a desafios reais de liderança e comunicação.",
            contents: [
                {
                    title: "1. Introdução",
                    paragraphs: [
                        "Na prática, a agilidade exige capacidade de lidar com incertezas e resolver problemas de comunicação de forma colaborativa.",
                        "O sucesso depende muito mais de pessoas, mentalidade e adaptação empírica do que do cumprimento mecânico de regras e processos."
                    ]
                },
                {
                    title: "2. Conceitos Fundamentais",
                    paragraphs: [
                        "Os requisitos em projetos ágeis são expressos de forma simples e orientada a valor:"
                    ],
                    topics: [
                        "User Stories: Declarações simples sob a ótica do usuário contendo: Papel (Como...), Necessidade (Quero...) e Benefício (Para...).",
                        "Critérios de Aceitação: Condições específicas que a User Story deve cumprir para que o Product Owner a valide.",
                        "Estimativa Ágil: Previsões baseadas em informações imperfeitas e incompletas para apoiar previsões, e não compromissos contratuais rígidos e inegociáveis."
                    ]
                },
                {
                    title: "3. Pontos Mais Cobrados",
                    paragraphs: [
                        "Os cenários de exames apresentam dilemas comuns de gerenciamento no dia a dia:"
                    ],
                    topics: [
                        "Mudanças de Requisitos: Solicitações de mudanças do cliente durante a execução devem ser avaliadas e priorizadas pelo PO no backlog, visando agregar valor.",
                        "Sprint não concluída: Se o time não entrega tudo o que planejou para a Sprint, ajusta-se a estimativa e o planejamento futuro na Retrospective; não se estende o tempo da Sprint.",
                        "Gestão de Riscos: Ocorre de forma embutida e contínua através das entregas incrementais frequentes e do feedback de usuários.",
                        "Conflitos de Comunicação: Devem ser discutidos e resolvidos pelo próprio time durante a Sprint Retrospective."
                    ]
                },
                {
                    title: "4. Erros Mais Comuns",
                    paragraphs: [
                        "Adoção Mecânica: Aplicar eventos e termos técnicos do Scrum (reuniões, papéis) sem de fato vivenciar os princípios de transparência, inspeção e adaptação.",
                        "Negligenciar Critérios de Aceitação: Entregar histórias incompletas ou sem validação do PO para inflar artificialmente o Velocity da Sprint.",
                        "Pular o refinamento de itens de backlog, gerando histórias grandes demais (Epics) que geram alto risco, incertezas e travam o fluxo de desenvolvimento."
                    ]
                },
                {
                    title: "5. Resumo Estratégico",
                    paragraphs: [
                        "O sucesso em projetos ágeis apoia-se no aprendizado contínuo, no empoderamento das pessoas, no trabalho colaborativo e na colaboração estreita com o cliente."
                    ],
                    summary: "Previsões ágeis são dinâmicas e baseadas em dados empíricos de desempenho anterior do próprio time, como a média do Velocity."
                },
                {
                    title: "6. Dicas para a Prova",
                    paragraphs: [
                        "Analise com atenção as responsabilidades de liderança do time Scrum no dia a dia:"
                    ],
                    topics: [
                        "O Scrum Master atua auxiliando o time a remover impedimentos e a se auto-organizar, nunca cobrando individualmente ou distribuindo tarefas.",
                        "O Product Owner prioriza o Product Backlog visando maximizar o valor de negócio entregue ao cliente, com base em retorno financeiro ou importância técnica.",
                        "User Stories bem escritas e refinadas com critérios de aceitação claros reduzem riscos de desalinhamento de expectativas.",
                        "A melhoria contínua depende de o time refletir regularmente sobre sua forma de trabalhar e implementar ações corretivas imediatamente."
                    ]
                }
            ]
        }
    ];
})();
