# Definition of Ready (DoR) e Definition of Done (DoD) - Sprint 2

## 📋 Definition of Ready (DoR) - Para iniciar a Sprint

Para que as User Stories sejam consideradas "prontas para o desenvolvimento", elas devem cumprir:

- [x] **Identificação Única**: Cada US deve estar vinculada a uma Issue no GitHub com ID claro.
- [x] **Critérios de Aceitação**: Os objetivos de cada história devem estar detalhados no backlog.
- [x] **Design Disponível**: Protótipo da Tela de Exame no Figma finalizado.
- [x] **Fluxo Lógico Definido**: Definição clara das rotas de avaliação e mix de dificuldades (US04/US05).

## ✅ Definition of Done (DoD) - Para concluir a Sprint

Uma User Story só é considerada "Pronta" se atender aos critérios abaixo:

**Geral (Gestão e Qualidade)**

- [x] **Versionamento**: Código desenvolvido em branch separada; commits seguindo o padrão `<tipo> (#id): descrição`.
- [x] **Processo de PR**: Pull Request aberto com descrição dos testes e aprovado via Code Review por outro integrante.
- [x] **Tecnologias Puras**: Uso exclusivo de HTML, CSS, JS e PostgreSQL (sem frameworks).

**Específico por User Story**
| ID | User Story | ✅ | DoD |
| --- | --- | --- | --- |
| US00 | Infraestrutura, Banco de Dados e Documentação Técnica | [ ] | Diagramas atualizados (Sequência, Caso de Uso, Classe); Relatório sprint-2.md concluído; Vídeo postado no YouTube. |
| US04 | Realização de Avaliação por Nível | [ ] | Interface responsiva funcional; API de próxima questão retornando mix correto (3 Fáceis, 4 Médias, 3 Difíceis). |
| US05 | Gestão de Tentativas e Notas | [ ] | Persistência de respostas validada; Bloqueio de 3ª tentativa (403); Maior nota persistida na tabela de exames. |
| US07 | Auditoria de Histórico | [x] | Metadados de tempo e exame registrados; Prevenção de duplicidade (409); Auditoria de sorteio garantida (RF10). |
