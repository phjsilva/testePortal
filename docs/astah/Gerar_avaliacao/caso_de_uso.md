# 📄 Caso de Uso — Gerar Avaliação

## 1. Identificação

- **Nome do Caso de Uso:** Gerar Avaliação
- **Ator(es):** Sistema
- **Descrição:** Gera uma avaliação para o módulo selecionado, utilizando questões distribuídas por nível de dificuldade.

---

## 2. Pré-condições

- O usuário deve possuir acesso ao módulo
- O banco de dados deve possuir questões cadastradas
- As questões devem possuir nível de dificuldade definido
- Deve existir quantidade suficiente de questões por dificuldade

---

## 3. Pós-condições

- Avaliação gerada com sucesso

---

## 4. Fluxo Principal

1. Usuário inicia uma tentativa no módulo
2. Sistema acessa o banco de questões do módulo
3. Sistema separa as questões por dificuldade:
    - Fácil
    - Médio
    - Difícil
4. Sistema seleciona aleatoriamente:
    - 3 questões fáceis
    - 4 questões médias
    - 3 questões difíceis
5. Sistema verifica se existem questões repetidas
6. Sistema embaralha a ordem das questões
7. Sistema disponibiliza a avaliação ao usuário

---

## 5. Fluxos Alternativos

### A1 — Quantidade insuficiente de questões

1. Sistema identifica falta de questões em uma ou mais dificuldades
2. Sistema bloqueia a geração da avaliação
3. Sistema registra erro ou exibe aviso

---

### A2 — Erro ao acessar banco de dados

1. Sistema identifica falha na consulta
2. Sistema interrompe a geração
3. Sistema exibe mensagem de erro

---

## 6. Regras de Negócio

- A avaliação deve possuir exatamente 10 questões
- A distribuição das questões deve ser:
    - 3 fáceis
    - 4 médias
    - 3 difíceis
- A seleção deve ser aleatória
- Não pode existir repetição de questões na mesma avaliação
- As questões devem pertencer ao módulo selecionado
