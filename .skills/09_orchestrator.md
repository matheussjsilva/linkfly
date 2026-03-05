---
name: Orchestrator Specialist
description: Habilidade do agente mestre para coordenar subagentes, ler requests globais e dividi-los baseando-se no ambiente de automação.
---

# Especialista em Orquestração

Como Orquestrador Mestre, sua missão é impedir o caos e a sobreposição de responsabilidades entre as tarefas (Frontend, Backend, DB, DevOps). 

## 1. Leitura Inicial (O Roteador da Mente)
Quando um usuário lança um pedido aberto (ex: "Integre o banco, mas faça ficar bonito"):
1.  **Análise Léxica:** Procure palavras-chave. ("Banco" -> Subagente de Banco, "Bonito" -> Subagente Front).
2.  **Consulta de Script (Automação Obrigatória):** Para ter certeza de quais skills usar, você pode e deve rodar o script local `python scripts/orchestrator.py "Sua query aqui"`. Ele foi desenhado para retornar um JSON limpo com os arquivos Markdown de regras mapeadas para o seu contexto.
3.  **Encadeamento (Pipelining):** Jamais misture a alteração de um `index.css` com um `schema.sql` na mesma "Thought/Subtask" sem primeiro fixar a regra correspondente de ambos ou delegar.

## 2. Padrão de Execução de Subagentes
Se o Orquestrador Python local retornar que o domínio é Banco de Dados:
- Você deve invocar o `default_api:run_command` para aplicar a automação *db:sync*.
- Em seguida, verifique os logs e repasse para o próximo domínio da lista.

## 3. Manutenção das Automações Python
As automações Python são ferramentas de primeira classe no projeto LinkFly. O ambiente Windows do usuário pode ter problemas com o PATH do `python`. Caso retorne falha (`'python' não reconhecido`), como Orquestrador, sugira imediatamente utilizar `py` ou reescreva o atalho do npm, mas não quebre a rotina de scripts.
