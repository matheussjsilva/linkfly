---
name: Automated Testing Manager
description: Skill para utilizar o script de gerenciamento do ambiente de testes antes de abrir instâncias de navegadores via browser_subagent.
---

# Testes Automatizados e Gerenciador de Ambiente

Qualquer subagente de UI/UX ou encarregado de fazer testes visuais utilizando o `browser_subagent` **deve obrigatoriamente** acionar o script de gerenciamento de ambiente antes de assumir qual porta a aplicação está rodando.

O ecossistema Vite pode alterar portas (5173, 5174, etc.) dependendo de falhas de liberação no Windows, ou o servidor Node.js pode estar desligado e retornando ERR_CONNECTION_REFUSED.

## Como Iniciar um Teste Visual de Forma Segura

1. Antes de invocar o `default_api:browser_subagent`, o desenvolvedor/agente principal deve executar a automação de verificação:
`python scripts/test_env_manager.py`
2. O script vai verificar se os pacotes (`node_modules`) estão instalados em ambas as pastas (raízes). Caso precise, os instalará.
3. Ele verificará via *socket* no Windows se o backend (porta 3000) e o frontend (porta 5173+) estão rodando. Se estiverem caídos, o script mandará os processos nativos em background e esperará voltarem.
4. O script gerará um JSON limpo com a URL verdadeira onde o Frontend estancou.
5. Copie essa URL (`frontend_url`) do output do Python e injete-a na string da instrução (Task) que vai ser enviada para o Web Browser Subagent.
