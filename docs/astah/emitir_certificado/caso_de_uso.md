# 📄 Caso de Uso — Emitir Certificado

## 1. Identificação

- **Nome do Caso de Uso:** Emitir Certificado
- **Ator(es):** Sistema
- **Descrição:** Gera e disponibiliza um certificado digital para usuários aprovados.

---

## 2. Pré-condições

- O usuário deve possuir resultado final aprovado
- A média final deve estar calculada
- Os dados do usuário devem estar cadastrados no sistema

---

## 3. Pós-condições

- Certificado gerado com sucesso
- Certificado disponível para visualização ou download

---

## 4. Fluxo Principal

1. Sistema verifica o resultado final do usuário
2. Sistema confirma que o usuário está aprovado
3. Sistema recupera os dados do usuário:
    - Nome completo
    - CPF
    - E-mail
4. Sistema recupera:
    - Média final
    - Notas dos módulos (opcional)
5. Sistema gera o certificado digital
6. Sistema registra o certificado (opcional)
7. Sistema disponibiliza o certificado ao usuário

---

## 5. Fluxos Alternativos

### A1 — Usuário reprovado

1. Sistema identifica resultado insuficiente
2. Sistema bloqueia emissão do certificado
3. Sistema informa reprovação

---

## 6. Regras de Negócio

- O certificado só pode ser emitido para usuários aprovados
- O certificado deve conter:
    - Nome completo
    - CPF
    - E-mail
    - Data de emissão
    - Média final
- O sistema pode incluir notas por módulo
- O certificado deve ser gerado em formato digital
