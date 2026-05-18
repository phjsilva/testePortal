# Sprint 1: Fundação e Acesso

Esta sprint focou na criação da base do sistema, incluindo infraestrutura, banco de dados e as funcionalidades essenciais de cadastro e autenticação de usuários.

---

## 📋 User Stories da Sprint 1

|    ID    | User Story                                                                                                                                | Requisitos Relacionados  |
| :------: | ----------------------------------------------------------------------------------------------------------------------------------------- | :----------------------: |
| **US00** | **Infraestrutura, Banco de Dados e Documentação Técnica**                                                                                 | RNF05, RNF06, RP02, RP04 |
| **US01** | **Cadastro de Usuário**: Como novo usuário, quero me cadastrar no portal fornecendo CPF, nome, e-mail e senha para acessar as avaliações. |       RF01, RNF03        |
| **US02** | **Autenticação Segura**: Como usuário cadastrado, quero realizar login com CPF e senha para manter meu progresso salvo.                   |       RF02, RNF04        |

---

## 📦 Sprint Backlog

- **US00 - Infraestrutura, Banco de Dados e Documentação Técnica [#8](https://github.com/TeamStacked/PortalScrum/issues/8)**
  - [x] Configuração do repositório [#19](https://github.com/TeamStacked/PortalScrum/issues/19)
  - [x] Estruturação da documentação [#20](https://github.com/TeamStacked/PortalScrum/issues/20)
  - [x] Gestão de Qualidade (DoR/DoD) [#21](https://github.com/TeamStacked/PortalScrum/issues/21)
  - [x] Style Guide do Projeto [#22](https://github.com/TeamStacked/PortalScrum/issues/22)
  - [x] Diagrama de Caso de Uso [#23](https://github.com/TeamStacked/PortalScrum/issues/23)
  - [x] Diagrama de Classes [#24](https://github.com/TeamStacked/PortalScrum/issues/24)
  - [x] Diagrama de Sequência [#25](https://github.com/TeamStacked/PortalScrum/issues/25)
  - [x] Scripts DDL de Estrutura [#26](https://github.com/TeamStacked/PortalScrum/issues/26)
  - [x] Scripts DML de Carga (Seed) [#27](https://github.com/TeamStacked/PortalScrum/issues/27)
  - [x] Automação de Banco [#28](https://github.com/TeamStacked/PortalScrum/issues/28)
  - [x] Prototipagem do sequenciamento de telas [#38](https://github.com/TeamStacked/PortalScrum/issues/38)

- **US01 - Cadastro de Usuário [#1](https://github.com/TeamStacked/PortalScrum/issues/1)**
  - [x] Prototipagem de Cadastro (Figma) [#10](https://github.com/TeamStacked/PortalScrum/issues/10)
  - [x] HTML/CSS do Cadastro [#11](https://github.com/TeamStacked/PortalScrum/issues/11)
  - [x] Integração de Cadastro (JS) [#12](https://github.com/TeamStacked/PortalScrum/issues/12)
  - [x] Setup do Servidor Node.js [#29](https://github.com/TeamStacked/PortalScrum/issues/29)
  - [x] API de Cadastro (Rota) [#14](https://github.com/TeamStacked/PortalScrum/issues/14)
  - [x] Tratamento de Dados LGPD [#30](https://github.com/TeamStacked/PortalScrum/issues/30)
  - [x] Validação de Front-end [#34](https://github.com/TeamStacked/PortalScrum/issues/34)

- **US02 - Autenticação Segura [#2](https://github.com/TeamStacked/PortalScrum/issues/2)**
  - [x] Prototipagem de Login (Figma) [#15](https://github.com/TeamStacked/PortalScrum/issues/15)
  - [x] HTML/CSS de Login [#16](https://github.com/TeamStacked/PortalScrum/issues/16)
  - [x] Integração de Login (JS) [#17](https://github.com/TeamStacked/PortalScrum/issues/17)
  - [x] Feedback ao Usuário [#18](https://github.com/TeamStacked/PortalScrum/issues/18)
  - [x] Módulo de Criptografia [#31](https://github.com/TeamStacked/PortalScrum/issues/31)
  - [x] Módulo JWT [#32](https://github.com/TeamStacked/PortalScrum/issues/32)
  - [x] Middleware de Autorização [#33](https://github.com/TeamStacked/PortalScrum/issues/33)

---

## DoR e DoD da Sprint

- 👆 [DOR_DOD.md](/docs/sprint-1/DOR_DOD.md)

---

## 📉 Burndown Chart

![Burndown Chart](/docs/sprint-1/burndown_chart_sprint_1.png)

### ⚓ Análise de Execução

**Observação sobre o ritmo:**

Notamos que o gráfico demorou a "engrenar" inicialmente (platô entre 18 e 22 de Abril). Isso ocorreu porque tivemos feriado nacional em 22 de Abril 📅. Após o feriado, o progresso acelerou drasticamente, atingindo a meta de 0 pontos abertos no dia 30 de Abril.

---

## 🚀 Entregas e Resultados

Nesta sprint, foram entregues:

- Configuração inicial do ambiente de desenvolvimento.
- Estrutura do banco de dados PostgreSQL.
- Funcionalidades de cadastro e login de usuários com segurança (JWT e Scrypt).
- Documentação técnica inicial.

---

<!-- ## ⚠️ Desafios e Aprendizados -->

<!-- [Adicionar desafios enfrentados e lições aprendidas durante a sprint, como decisões de arquitetura, problemas de integração, etc.] -->

## 🔜 Próximos Passos

A Sprint 2 focará na implementação do motor de avaliação, gerenciamento de tentativas e notas, e o registro detalhado do histórico de exames para fins de auditoria.

---

🔗 [Ver registros de Daily Meeting desta Sprint](https://github.com/TeamStacked/PortalScrum/issues?q=is%3Aissue%20label%3Adaily%20milestone%3A%22Sprint%201%22)
