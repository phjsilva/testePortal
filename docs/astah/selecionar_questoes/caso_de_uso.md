# 📄 Caso de Uso — Selecionar Questões

## 1. Identificação

- **Nome do Caso de Uso:** Selecionar Questões
- **Ator(es):** Sistema
- **Descrição:** Seleciona aleatoriamente as questões que irão compor a avaliação do módulo, respeitando a distribuição por dificuldade.

---

## 2. Pré-condições

- O módulo deve possuir questões cadastradas
- As questões devem possuir nível de dificuldade definido
- Deve existir quantidade suficiente de questões por dificuldade

---

## 3. Pós-condições

- Questões selecionadas para a avaliação
- Questões vinculadas à tentativa do usuário

---

## 4. Fluxo Principal

1. Sistema acessa o banco de questões do módulo
2. Sistema separa as questões por dificuldade:
    - Fácil
    - Médio
    - Difícil
3. Sistema seleciona aleatoriamente:
    - 3 questões fáceis
    - 4 questões médias
    - 3 questões difíceis
4. Sistema verifica se existem questões repetidas
5. Sistema organiza as questões selecionadas
6. Sistema retorna as questões para geração da avaliação

---

## 5. Fluxos Alternativos

### A1 — Quantidade insuficiente de questões

1. Sistema identifica falta de questões em uma das dificuldades
2. Sistema interrompe seleção
3. Sistema registra erro ou exibe aviso

---

## 6. Regras de Negócio

- Devem ser selecionadas exatamente 10 questões
- A distribuição deve ser:
    - 3 fáceis
    - 4 médias
    - 3 difíceis
- A seleção deve ocorrer de forma aleatória
- Não pode existir repetição de questões na mesma avaliação
- As questões devem pertencer ao módulo selecionado
