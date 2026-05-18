# 📄 Caso de Uso — Consultar Progresso

## 1. Identificação

- **Nome do Caso de Uso:** Consultar Progresso
- **Ator(es):** Usuário
- **Descrição:** Permite que o usuário visualize seu desempenho, histórico de tentativas e progresso nos módulos do sistema.

---

## 2. Pré-condições

- O usuário deve estar autenticado no sistema
- O usuário deve possuir pelo menos uma tentativa registrada

---

## 3. Pós-condições

- Informações de progresso exibidas ao usuário

---

## 4. Fluxo Principal

1. Usuário acessa o dashboard do sistema
2. Sistema identifica o usuário autenticado
3. Sistema recupera os dados de progresso
4. Sistema busca:
    - Histórico de tentativas
    - Notas por módulo
    - Média geral
5. Sistema calcula o progresso do usuário
6. Sistema exibe as informações no dashboard

---

## 5. Fluxos Alternativos

### A1 — Nenhuma tentativa registrada

1. Sistema identifica ausência de tentativas
2. Sistema exibe mensagem informando que não há progresso disponível

---

## 6. Regras de Negócio

- O usuário pode visualizar apenas os próprios dados
- O progresso deve ser atualizado após cada tentativa
- O dashboard pode exibir:
    - Quantidade de tentativas
    - Notas dos módulos
    - Média geral
    - Status de aprovação
- O sistema deve manter histórico das tentativas realizadas
