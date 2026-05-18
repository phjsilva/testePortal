# 📄 Caso de Uso — Consultar Dificuldade da Questão

## 1. Identificação

- **Nome do Caso de Uso:** Consultar Dificuldade da Questão
- **Ator(es):** Sistema
- **Descrição:** Permite que o sistema consulte o nível de dificuldade das questões armazenadas no banco de dados para utilização na geração das avaliações.

---

## 2. Pré-condições

- As questões devem estar cadastradas no banco de dados
- Cada questão deve possuir um nível de dificuldade definido

---

## 3. Pós-condições

- As dificuldades das questões ficam disponíveis para os processos internos do sistema

---

## 4. Fluxo Principal

1. Sistema acessa o banco de dados
2. Sistema recupera as questões cadastradas
3. Sistema identifica o nível de dificuldade de cada questão
4. Sistema organiza as questões por dificuldade:
    - Fácil
    - Médio
    - Difícil
5. Sistema disponibiliza os dados para geração das avaliações

---

## 5. Fluxos Alternativos

### A1 — Questão sem dificuldade definida

1. Sistema identifica inconsistência
2. Sistema ignora a questão
