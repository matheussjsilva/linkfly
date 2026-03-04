---
name: Supabase Connection Handling
description: Regras específicas para a conexão e manuseio do Supabase neste projeto.
---
# Tratamento da Conexão com o Supabase

O projeto LinkFly utiliza o Supabase como Banco de Dados Principal (PostgreSQL) e Camada de Autenticação/Backend-as-a-Service (BaaS).

## 1. Credenciais do Projeto (LinkFly)
*   **URL do Projeto (API URL):** `https://krljvuxngvkbngddapxp.supabase.co`
*   **Publishable Key:** `sb_publishable_0sSplMZNTAudVtrvXnTTNg_JOGVWTMl`
*   **Anon Key (JWT):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtybGp2dXhuZ3ZrYm5nZGRhcHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzE5NTcsImV4cCI6MjA4NTgwNzk1N30.WA7WwBwbt3G2obbNg8_dwCD2CGEC7w1Wngqf1ArQJxI`
*   **Schema Padrão Utilizado:** `linkfly`

## 2. Inicialização e Uso do Supabase Client
A IA deve seguir a política correta de chaves de acesso dependendo de qual lado da arquitetura ela está atuando.

### No Frontend (Navegador/Cliente):
*   Você PODE e DEVE utilizar a URL pública referenciada acima combinada APENAS com a **Publishable Key (Anon Key)**.
*   Essa chave apenas fornece acesso às requisições autenticadas por RLS (Row Level Security) e acesso anônimo.
*   NÃO injete nem use `supabase_service_role_key` no front. 

### No Backend (Node.js/Express Controller):
*   Sempre utilize a SDK oficial (`@supabase/supabase-js`).
*   Para operações administrativas críticas (ignorando RLS) que o cliente não tem direito de executar, você deverá criar a client apontando para `process.env.SUPABASE_SERVICE_ROLE_KEY`. (Isso requer o secret no `.env` do backend).
*   Prefira, no entanto, passar o *JWT token* do usuário recebido na requisição HTTP para que o Supabase acione a RLS e proteja a rota no nível do banco `supabase.auth.setSession()`.

## 3. Consultas e Restrições ao Banco
*   **Exaustão do Banco:** Ao sugerir Queries via backend, NUNCA faça queries `.select('*')` quando a tabela é muito larga e somente poucas colunas são precisas (ex: retornar `profiles` completa). Dê sempre o foco nas colunas precisadas.
*   **Esquema LinkFly:** O banco conta com as tabelas de domínio armazenadas no schema particular `linkfly`. Caso utilize PostgREST (API do Supabase), declare nas opções do client: `const supabase = createClient(url, anonKey, { db: { schema: 'linkfly' } })`.
