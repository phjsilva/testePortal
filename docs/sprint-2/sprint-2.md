# Sprint 2: Core e Avaliações

Esta sprint focou na implementação do motor de avaliação, gerenciamento de tentativas e notas, e o registro detalhado do histórico de exames para fins de auditoria.

---

## 📋 User Stories da Sprint 2

|    ID    | User Story                                                                                                                                                       | Requisitos Relacionados  |
| :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------: |
| **US00** | **Infraestrutura, Banco de Dados e Documentação Técnica**                                                                                                        | RNF05, RNF06, RP02, RP04 |
| **US04** | **Realização de Avaliação por Nível**: Como usuário, quero realizar provas de 10 questões (com mix de dificuldades) para validar meu conhecimento em cada nível. |     RF03, RF04, RF05     |
| **US05** | **Gestão de Tentativas e Notas**: Como usuário, quero ter até 2 tentativas por nível, com o sistema retendo minha melhor nota para o cálculo final.              |     RF06, RF07, RF08     |
| **US07** | **Auditoria de Histórico**: Como sistema, devo registrar a data/hora e questões de cada tentativa para fins de auditoria.                                        |           RF10           |

---

## 📦 Sprint Backlog

- **US00 - Infraestrutura, Banco de Dados e Documentação Técnica**
  - [ ] Finalização do Diagrama de Sequência (Fluxo de Avaliação) [#66](https://github.com/TeamStacked/PortalScrum/issues/66)
  - [x] Refatoração do Diagrama de Caso de Uso [#67](https://github.com/TeamStacked/PortalScrum/issues/67)
  - [x] Refatoração do Diagrama de Classe [#68](https://github.com/TeamStacked/PortalScrum/issues/68)
  - [ ] Registro da documentação da Sprint 2 [#69](https://github.com/TeamStacked/PortalScrum/issues/69)
  - [ ] Vídeo do Incremento da Sprint 2 (YouTube) [#70](https://github.com/TeamStacked/PortalScrum/issues/70)

- **US04 - Realização de Avaliação por Nível**
  - [x] Prototipagem da Tela de Exame (Figma) [#72](https://github.com/TeamStacked/PortalScrum/issues/72)
  - [x] HTML/CSS da Tela de Exame (Responsivo) [#73](https://github.com/TeamStacked/PortalScrum/issues/73)
  - [x] Função findProximaQuestaoByUsuario com Mix de Dificuldade [#74](https://github.com/TeamStacked/PortalScrum/issues/74)
  - [x] Rota GET /api/questoes/proxima-questao [#75](https://github.com/TeamStacked/PortalScrum/issues/75)
  - [ ] Integração Front-end para exibição dinâmica de questões [#76](https://github.com/TeamStacked/PortalScrum/issues/76)

- **US05 - Gestão de Tentativas e Notas**
  - [x] Função inserirRespostaQuestao e findQuestaoDoExameByUsuario [#77](https://github.com/TeamStacked/PortalScrum/issues/77)
  - [x] Rota POST /api/questoes/responder [#78](https://github.com/TeamStacked/PortalScrum/issues/78)
  - [x] Lógica de validação e bloqueio de tentativas (Máximo 2 por nível) [#79](https://github.com/TeamStacked/PortalScrum/issues/79)
  - [ ] Cálculo automático da melhor nota por nível e persistência [#80](https://github.com/TeamStacked/PortalScrum/issues/80)
  - [ ] Feedback visual de conclusão de exame e progresso [#81](https://github.com/TeamStacked/PortalScrum/issues/81)

- **US07 - Auditoria de Histórico** ✅
  - [x] Registro de metadados na tabela de respostas (Data/Hora e ID do Exame) [#82](https://github.com/TeamStacked/PortalScrum/issues/82)
  - [x] Função findRespostaByExameEQuestao para evitar duplicidade [#83](https://github.com/TeamStacked/PortalScrum/issues/83)
  - [x] Persistência das questões sorteadas para fins de auditoria [#84](https://github.com/TeamStacked/PortalScrum/issues/84)

---

## DoR e DoD da Sprint

- 👆 [DOR_DOD.md](./DOR_DOD.md)

---

## 📉 Burndown Chart

![Burndown Chart](/docs/sprint-2/burndown_chart_sprint_2.png)

### ⚓ Análise de Execução

**Observação sobre o ritmo:**

[Adicionar análise de execução da sprint aqui baseada no Burndown.]

---

## 🚀 Entregas e Resultados

Nesta sprint, foram entregues:

- Motor de avaliação com sorteio aleatório de questões por dificuldade.
- Sistema de controle de tentativas (limite de 2 por nível).
- Persistência de histórico de respostas para auditoria.
- Diagramas técnicos atualizados (Sequência, Caso de Uso e Classe).

---

## 🔜 Próximos Passos

A Sprint 3 será dedicada à criação do dashboard de progresso do estudante e à funcionalidade de emissão do certificado final em PDF, consolidando a experiência do usuário.

---

🔗 [Ver registros de Daily Meeting desta Sprint](https://github.com/TeamStacked/PortalScrum/issues?q=is%3Aissue%20label%3Adaily%20milestone%3A%22Sprint%202%22)

---

## 💡 Observações

<!-- [Adicionar quaisquer observações ou pré-requisitos importantes para esta sprint.] -->
