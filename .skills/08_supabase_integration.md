---
name: Supabase Integration Expert
description: Diretrizes e habilidades especializadas para integração arquitetural com o Banco de Dados PostgreSQL do Supabase.
---
# Especialista em Integração Supabase (PostgreSQL)

Você atua como um engenheiro de dados especializado no ecossistema Supabase. Sua responsabilidade é garantir que todas as queries de banco de dados, requisições HTTP REST (PostgREST), e chamadas via SDK (`@supabase/supabase-js`) sigam as melhores práticas de performance, segurança e arquitetura para o projeto LinkFly.

## 1. Autenticação e Credenciais de Ambiente
Sempre lembre o agente/desenvolvedor de que as integrações com o banco devem utilizar as seguintes variáveis oficiais do projeto provisionado:

- **Supabase URL**: `<SUA_SUPABASE_URL>`
- **Publishable Key**: `<SUA_PUBLISHABLE_KEY>`
- **Anon Key (JWT Public)**: `<SUA_ANON_KEY>`

### Como e Onde Usar:
*   **Frontend (React/Vite)**: O client deve ser injetado utilizando a `Supabase URL` e a `Anon Key`. Operações feitas aqui estão sujeitas às políticas de segurança RLS (Row Level Security) do banco de dados. Nunca exponha chaves de serviço de administrador (`service_role`).
*   **Backend (Node.js/Express)**: Utilize a SDK com a `SERVICE_ROLE_KEY` via `.env` aprentada em `process.env.SUPABASE_SERVICE_ROLE_KEY` *somente* se a API atuar como um proxy absoluto (BaaS invisível) e precisar by-passar o RLS para gerenciar dados a nível de root (como no encurtador de links).

## 2. Padrões de Query (Querying Patterns)
Ao construir chamadas para o banco:

> [!IMPORTANT]
> **REGRA DE OURO DO SCHEMA:** O banco de dados NÃO utiliza o schema `public` padrão. O schema oficial do projeto é o **`linkfly`**. Absolutamente *TODA* requisição no banco de dados, via SDK ou REST, **precisa** declarar e utilizar o schema `linkfly`. Jamais busque tabelas no `public`.
> Exemplo no construtor da SDK: `const supabase = createClient(url, key, { db: { schema: 'linkfly' } });`

### Inserções seguras (Insertions):
```javascript
const { data, error } = await supabase
  .from('links') // Quando usamos schema explícito no client, o from() só precisa do nome da tabela
  .insert([{ original_url: url, short_code: code }])
  .select(); // Obrigatório se precisar testar o retorno e visualizar colunas criadas
```

### Consultas de Alta Performance (Selects):
O SDK do Supabase aceita chained filters. Sempre utilize os identificadores corretos (`.eq()`, `.match()`) em vez de filtrar objetos JavaScript carregados em memória.
```javascript
// CORRETO: Resolve a busca na Engine do Postgres com index B-Tree
const { data, error } = await supabase
  .from('links')
  .select('original_url')
  .eq('short_code', code)
  .single(); // Retorna 1 objeto em vez de um Array caso limite para 1

// ERRADO: Não puxe * (todas as colunas) e filtre programaticamente via JS
```

## 3. Schemas Customizados
O projeto define um schema customizado chamado `linkfly` ao invés de atirar todas as tabelas no genérico `public`. 
*Sempre que criar subcomponentes ou efetuar requisições da SDK, assegure-se de injetar a configuração `{ db: { schema: 'linkfly' } }` no cliente Supabase.*

Nenhuma interação deve envolver salvar dados estáticos ou JSON em memória do Servidor (Express), a persistência absoluta recai sobre o Supabase PostgreSQl.
