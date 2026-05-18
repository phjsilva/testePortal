# 📄 Caso de Uso — Gerar Nota por Módulo

## 1. Identificação

- **Nome do Caso de Uso:** Gerar Nota por Módulo
- **Ator(es):** Sistema
- **Descrição:** Calcula a nota final do módulo com base nas tentativas realizadas pelo usuário.

---

## 2. Pré-condições

- O usuário deve ter realizado pelo menos uma tentativa no módulo
- As respostas da tentativa devem estar registradas

---

## 3. Pós-condições

- Nota do módulo calculada
- Resultado armazenado no sistema
- Nota disponível para consulta

---

## 4. Fluxo Principal

1. Usuário finaliza a tentativa do módulo
2. Sistema compara as respostas com o gabarito
3. Sistema calcula a nota da tentativa
4. Sistema verifica as tentativas já existentes no módulo
5. Sistema identifica a maior nota entre as tentativas
6. Sistema define a maior nota como nota final do módulo
7. Sistema salva o resultado
8. Sistema disponibiliza a nota ao usuário

---

## 5. Fluxos Alternativos

### A1 — Primeira tentativa do módulo

1. Sistema identifica ausência de tentativas anteriores
2. Sistema define a nota atual como nota principal do módulo

---

### A2 — Limite de tentativas atingido

1. Sistema identifica duas tentativas já realizadas
2. Sistema bloqueia novas tentativas para o módulo

---

## 6. Regras de Negócio

- Cada módulo permite no máximo 2 tentativas
- Cada tentativa gera uma nota independente
- A nota final do módulo será a maior nota obtida
- Todas as questões possuem o mesmo valor
- Apenas respostas corretas pontuam
