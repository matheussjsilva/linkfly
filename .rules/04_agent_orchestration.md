---
name: Agent Orchestrator Rules
description: Regras globais de arquitetura para orquestração de Agentes e Subagentes de IA no projeto LinkFly.
---

# Regras de Orquestração de Agentes (AI Orchestration)

Este documento define **quando** e **como** os agentes e subagentes devem utilizar as regras (`.rules/`) e habilidades (`.skills/`) específicas baseando-se no contexto da tarefa solicitada pelo usuário.

## 1. Princípio do Contexto Isolado
Nenhum agente deve carregar todas as *Skills* ou *Rules* de uma vez só na memória se não for necessário. O agente Orquestrador (que recebe a primeira mensagem do usuário) deve **delegar e acionar** os subagentes com foco exclusivo no seu domínio.

## 2. Mapa de Roteamento de Regras e Skills

### Domínio: Banco de Dados e Backend
Sempre que a solicitação do usuário mencionar: *persistência, schema, Supabase, Postgres, SQL, rotas Node.js, Mongoose, falha em query.*
**Obrigações do Agente:**
- **Ler e Aplicar Rule:** `.rules/03_supabase_connection.md`
- **Ler e Aplicar Skill:** `.skills/08_supabase_integration.md`
- **Ferramentas Esperadas:** Modificar `index.js`, executar migrações via scripts em Python, usar bibliotecas de SDK.

### Domínio: Frontend, UI/UX e Visual
Sempre que a solicitação mencionar: *cores, estética, AdSense, React, Vite, CSS, responsividade, layout, monetização.*
**Obrigações do Agente:**
- **Ler e Aplicar Rule:** `.rules/01_palette_and_style.md`
- **Ler e Aplicar Skill:** (Skills focadas em React/Vite e UI/UX).
- **Ferramentas Esperadas:** Interagir via `browser_subagent` rotineiramente para confirmar estética visual; modificar componentes `.jsx` e `.css`.

### Domínio: Infraestrutura e Tratamento de Erros
Sempre que a solicitação mencionar: *logs, crash, segurança, vazamento de chaves, terminal travado, permissão, git ignore.*
**Obrigações do Agente:**
- **Ler e Aplicar Rule:** `.rules/02_security_data_leaks.md` e `.rules/05_error_monitoring.md`
- **Obrigação Oculta:** Confirmar imediatamente via `grep` ou leitura do `.env` se não houve commits irregulares.

## 3. Integração com Automação Python (Orchestrator)
O orquestrador automatizado em Python (`scripts/orchestrator.py`) deve ser capaz de processar os arquivos e direcionar logicamente qualquer Subagente invocado. Todo agente atuando no LinkFly DEVE seguir a estratégia traçada por este Python ao aceitar uma nova `task.md`.
