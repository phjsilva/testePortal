# 📄 Caso de Uso — Calcular Resultado Final

## 1. Identificação

- **Nome do Caso de Uso:** Calcular Resultado Final
- **Ator(es):** Sistema
- **Descrição:** Calcula o resultado final do usuário com base nas notas finais obtidas nos módulos.

---

## 2. Pré-condições

- O usuário deve possuir notas finais nos 5 módulos
- As notas dos módulos devem estar registradas no sistema

---

## 3. Pós-condições

- Média final calculada
- Resultado final definido
- Dados armazenados no sistema

---

## 4. Fluxo Principal

1. Sistema recupera as notas finais dos módulos do usuário
2. Sistema verifica se todos os módulos possuem nota
3. Sistema calcula a média geral das notas
4. Sistema compara a média com a nota mínima exigida
5. Sistema define o resultado final:
    - Aprovado
    - Reprovado
6. Sistema salva o resultado final
7. Sistema disponibiliza o resultado ao usuário

---

## 5. Fluxos Alternativos

### A1 — Módulo sem nota

1. Sistema identifica ausência de nota em um ou mais módulos
2. Sistema interrompe o cálculo
3. Sistema informa inconsistência

---

## 6. Regras de Negócio

- O sistema deve considerar as notas finais dos 5 módulos
- A média final deve ser calculada utilizando a média aritmética simples
- O usuário deve possuir nota em todos os módulos
- Deve existir uma nota mínima para aprovação
- O resultado final deve ser:
    - Aprovado
    - Reprovado
