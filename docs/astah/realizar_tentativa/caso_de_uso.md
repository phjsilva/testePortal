# 📄 Caso de Uso — Realizar Tentativa por Módulo

## 1. Identificação

- **Nome do Caso de Uso:** Realizar Tentativa por Módulo
- **Ator(es):** Usuário
- **Descrição:** Permite que o usuário realize uma tentativa de avaliação em um módulo específico do sistema.

---

## 2. Pré-condições

- O usuário deve estar autenticado no sistema
- O módulo deve estar disponível
- O usuário não pode ter excedido o limite de tentativas do módulo

---

## 3. Pós-condições

- Tentativa registrada no sistema
- Nota da tentativa calculada
- Histórico atualizado
- Nota do módulo atualizada, se necessário

---

## 4. Fluxo Principal

1. Usuário acessa o módulo desejado
2. Sistema verifica quantas tentativas já existem para o módulo
3. Se tentativas < 2 → permite iniciar
4. Sistema gera a avaliação do módulo
5. Usuário responde as questões
6. Usuário finaliza a tentativa
7. Sistema calcula a nota da tentativa
8. Sistema registra a tentativa no histórico do módulo
9. Sistema atualiza a nota do módulo (maior nota)

---

## 5. Fluxos Alternativos

### A1 — Limite de tentativas atingido

1. Sistema identifica que o usuário já realizou duas tentativas
2. Sistema bloqueia nova tentativa
3. Sistema exibe mensagem informando limite atingido

---

### A2 — Módulo indisponível

1. Sistema identifica que o módulo não está disponível
2. Sistema exibe mensagem de indisponibilidade
3. Tentativa não é iniciada

---

## 6. Regras de Negócio

- Cada módulo permite no máximo 2 tentativas
- Cada tentativa gera uma nota independente
- A nota principal do módulo será a maior nota obtida
- A avaliação deve conter:
    - 3 questões fáceis
    - 4 questões médias
    - 3 questões difíceis
- As questões devem ser selecionadas aleatoriamente
- Não pode haver repetição de questões na mesma tentativa
