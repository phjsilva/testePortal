# 📄 Caso de Uso — Realizar Login

## 1. Identificação

- **Nome do Caso de Uso:** Realizar Login
- **Ator(es):** Usuário
- **Descrição:** Permite que um usuário autenticado acesse o sistema utilizando suas credenciais.

---

## 2. Pré-condições

- O usuário deve possuir uma conta cadastrada
- O usuário não deve estar autenticado no sistema

---

## 3. Pós-condições

- Usuário autenticado no sistema

---

## 4. Fluxo Principal

1. Usuário acessa a página de login
2. Sistema exibe formulário de autenticação
3. Usuário informa:
    - CPF
    - Senha
4. Usuário confirma o login
5. Sistema valida os dados informados
6. Sistema verifica se o usuário existe
7. Sistema compara a senha informada com a senha armazenada
8. Sistema autentica o usuário
9. Sistema gera um token
10. Sistema inicia a sessão do usuário
11. Sistema redireciona o usuário para a home

---

## 5. Fluxos Alternativos

### A1 — Campos obrigatórios inválidos

1. Sistema identifica campos vazios ou inválidos
2. Sistema exibe mensagem de erro
3. Usuário corrige os dados

---

### A2 — Usuário não encontrado

1. Sistema não localiza o CPF informado
2. Sistema exibe mensagem de erro
3. Login não é realizado

---

### A3 — Senha incorreta

1. Sistema identifica senha inválida
2. Sistema exibe mensagem de erro
3. Login não é realizado

---

## 6. Regras de Negócio

- O usuário deve utilizar CPF e senha válidos
- A senha deve ser verificada de forma criptografada
- Apenas usuários cadastrados podem acessar o sistema
