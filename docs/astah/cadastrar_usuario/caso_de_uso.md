# 📄 Caso de Uso — Cadastrar Usuário

## 1. Identificação

- **Nome do Caso de Uso:** Cadastrar Usuário
- **Ator(es):** Visitante
- **Descrição:** Permite que um visitante crie uma conta no sistema para acessar os módulos e realizar avaliações.

---

## 2. Pré-condições

- O usuário não deve estar autenticado no sistema
- O usuário deve acessar a tela de cadastro

---

## 3. Pós-condições

- Usuário cadastrado no sistema
- Dados armazenados no banco de dados
- Conta disponível para autenticação

---

## 4. Fluxo Principal

1. Usuário acessa a página de cadastro
2. Sistema exibe formulário de cadastro
3. Usuário informa:
    - Nome completo
    - CPF
    - E-mail
    - Senha
4. Usuário confirma o cadastro
5. Sistema valida os dados informados
6. Sistema verifica se já existe:
    - CPF cadastrado
    - E-mail cadastrado
7. Sistema criptografa a senha
8. Sistema salva os dados no banco
9. Sistema confirma o cadastro ao usuário

---

## 5. Fluxos Alternativos

### A1 — Campos obrigatórios inválidos

1. Sistema identifica campos inválidos ou vazios
2. Sistema exibe mensagem de erro
3. Usuário corrige os dados

---

### A2 — CPF já cadastrado

1. Sistema identifica CPF existente
2. Sistema bloqueia cadastro
3. Sistema informa duplicidade

---

### A3 — E-mail já cadastrado

1. Sistema identifica e-mail existente
2. Sistema bloqueia cadastro
3. Sistema informa duplicidade

---

## 6. Regras de Negócio

- CPF deve ser único
- E-mail deve ser único
- Todos os campos são obrigatórios
- Senha deve ser armazenada criptografada
- CPF deve possuir formato válido
- E-mail deve possuir formato válido

---
