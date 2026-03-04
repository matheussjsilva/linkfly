---
name: Strict Security and Data Leak Prevention
description: Regras fundamentais e críticas para impedir vazamento de dados, senhas, e dados sensíveis de clientes.
---
# Segurança Rigorosa e Prevenção de Vazamento de Dados

## 1. Dados de Conexão e Hardcoding (Vazamento de .env)
**NUNCA** faça hardcode de chaves, tokens, senhas ou strings de conexão com o banco de dados diretamente nos arquivos de código-fonte (js, ts, py, html, etc.).
*   Todas as credenciais críticas e de administração DEVEM ser lidas de um arquivo `.env`.
*   A IA está ESTRITAMENTE PROIBIDA de criar arquivos contendo segredos e commitar ou persistir no repositório. Arquivos `.env` devem sempre estar listados no `.gitignore`.
*   Ao fornecer exemplos de código para conexão, a IA USE APENAS: `process.env.SUPABASE_KEY_NAME`. Exclua qualquer valor real de suas respostas, a não ser as *publishable keys* (que são desenhadas para o frontend).

## 2. Tratamento de Exceções e Respostas da API (Vazamento de Estrutura Interna)
**NUNCA** retorne detalhes internos da infraestrutura ou do código:
*   As respostas de erro para o frontend (Client) devem ser genéricas: "Erro ao processar sua solicitação".
*   Em nenhuma hipótese a API (Express/Node) deve retornar um rastreamento de pilha (Stack Trace), consultas SQL mal formadas, dicas de versão do banco de dados, ou do framework em uso para os usuários.
*   Logue o erro completo apenas no backend usando ferramentas adequadas de logging estruturado (ex: Winston/Pino) com tratamento de dados sensíveis ocultos (redaction de senhas e tokens nos logs).

## 3. Dados de Clientes (LGPD/GDPR)
*   **Dados Sensíveis (PII - Personally Identifiable Information):** A IA NUNCA deve expor dados reais de clientes reais nos testes locais ou nos arquivos de simulação (mocks). Utilize bibliotecas de Fake Data (Faker.js) para gerar nomes falsos, emails falsos e CPFs/CNPJs mascarados ou inválidos propositalmente para testes.
*   O banco de dados de produção NUNCA deve ser exportado ou manipulado para o ambiente local sem prévia anonimização via scripts (Data Masking e redação).

## Regras de Atuação (IA)
Ao modificar qualquer rota no backend, a IA deve assegurar:
1. Try-Catch ou equivalente.
2. Não retorno de log interno para a requisição.
3. Não logar strings inteiras de request body (pode conter senhas).
