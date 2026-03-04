---
name: Error Monitoring Flow
description: Monitora erros e garante resolução robusta ao lidar com crashes da aplicação Front/Back.
---
# Prevenção de Caos (Monitoramento de Erro)

## Diretriz Primária para Rastreamento de Erros (React/Node)

Esta regra determina o processo analítico da IA antes de aplicar respostas a um código "quebrado" ou um stack trace postado.

1. **NÃO CHUTE A SOLUÇÃO:** Se um erro ocorrer (Ex: O Componente App.jsx falhou no build do Vite), a IA DEVE primeiro usar ferramentas de visualização (ex: `view_file`) no componente falho. Leia a linha de cima, a linha com problema e a de baixo.
2. **ISOLAMENTO DO ESTADO REACT:** A maioria dos bugs React estão em estado assíncrono atrasado. (Ex: Esperar um estado do `useState` no mesmo ciclo que o atualiza). Verifique sempre o fluxo temporal do componente.
3. **MÃO NA RODA DO SERVIDOR VITE:** Se um erro indicar `Failed to resolve import`, você sabe que o erro está no `package.json` vs Pathing relativo no JSX (`./` vs `../`). Você deve consertar a estrutura da pasta e refaturar o import, mantendo conformidade com as Regras de Estrutura (.rules/04).

## Feedback de Erro ao Backend
Como o Backend é node e o front é Vite, garanta que os Portos (Ex: Vite porta 5173, Backend porta 3000) **estejam conectados via proxy no `vite.config.js`** para evitar malditos erros de **CORS** que interrompem o fluxo (ex: `Failed to fetch`).
