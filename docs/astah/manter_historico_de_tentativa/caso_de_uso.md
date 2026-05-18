# 📄 Caso de Uso — Manter Histórico das Tentativas

## 1. Identificação

- **Nome do Caso de Uso:** Manter Histórico das Tentativas
- **Ator(es):** Sistema
- **Descrição:** Registra e mantém o histórico das tentativas realizadas pelo usuário em cada módulo.

---

## 2. Pré-condições

- O usuário deve estar autenticado
- O usuário deve realizar uma tentativa em um módulo
- A tentativa deve possuir resultado calculado

---

## 3. Pós-condições

- Tentativa registrada no histórico
- Dados vinculados ao usuário e ao módulo
- Histórico disponível para consulta

---

## 4. Fluxo Principal

1. Usuário finaliza uma tentativa do módulo
2. Sistema recupera os dados da tentativa:
    - Módulo
    - Quantidade de acertos
    - Nota da tentativa
    - Data e horário
3. Sistema verifica a quantidade de tentativas existentes no módulo
4. Sistema registra a nova tentativa no histórico
5. Sistema associa a tentativa ao usuário
6. Sistema mantém o histórico disponível para consultas futuras

---

## 5. Fluxos Alternativos

### A1 — Limite de tentativas atingido

1. Sistema identifica duas tentativas já registradas no módulo
2. Sistema impede novo registro de tentativa
3. Sistema informa bloqueio ao usuário

---

### A2 — Erro ao salvar histórico

1. Sistema identifica falha no banco de dados
2. Sistema interrompe operação
3. Sistema registra erro

---

## 6. Regras de Negócio

- Cada módulo permite no máximo 2 tentativas
- Cada tentativa deve ser registrada individualmente
- O histórico deve armazenar:
    - Nota da tentativa
    - Data da tentativa
    - Módulo relacionado
- O histórico não deve sobrescrever tentativas anteriores
- O usuário pode visualizar apenas o próprio histórico
