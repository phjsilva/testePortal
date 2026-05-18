# Definition of Ready (DoR) e Definition of Done (DoD) - Sprint 1

## 📋 Definition of Ready (DoR) - Para iniciar a Sprint

Para que as User Stories sejam consideradas "prontas para o desenvolvimento", elas devem cumprir:

- [x] **Identificação Única**: Cada US deve estar vinculada a uma Issue no GitHub com ID claro.
- [x] **Critérios de Aceitação**: Os objetivos de cada história devem estar detalhados (ex: US01 deve validar CPF único).
- [x] **Design Disponível**: Protótipos das telas de Cadastro e Login (Figma) finalizados para guiar o front-end.
- [x] **Dependências Mapeadas**: A infraestrutura de banco (US00) deve preceder a lógica de persistência de dados (US01).

## ✅ Definition of Done (DoD) - Para concluir a Sprint

Uma User Story só é considerada "Pronta" se atender aos critérios abaixo:

**Geral (Gestão e Qualidade)**

- [x] **Versionamento**: Código desenvolvido em branch separada; commits seguindo o padrão `<tipo> (#id): descrição`.
- [x] **Processo de PR**: Pull Request aberto com descrição dos testes e aprovado via Code Review por outro integrante.
- [x] **Tecnologias Puras**: Uso exclusivo de HTML, CSS, JS e PostgreSQL (sem frameworks).

**Específico por User Story**
| ID | User Story | ✅ | DoD |
| --- | --- | --- | --- |
| US00 | Infraestrutura, Banco de Dados e Documentação Técnica | [X] | Scripts DDL/DML funcionando via `npm run db:init`; README completo com os 10 itens obrigatórios. |
| US01 | Cadastro de Usuário | [X] | Dados salvos no banco PostgreSQL respeitando a LGPD; senhas armazenadas com Hash (Scrypt). |
| US02 | Autenticação Segura | [X] | Autenticação funcional com geração de Token JWT e rota de login validada via Curl. |
