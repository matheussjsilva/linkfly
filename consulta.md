# Consulta LinkFly - Documentação Central e Funcionamento

## 1. Funcionamento do Projeto (Visão Geral)
O **LinkFly** é um projeto de encurtador de URLs focado na rapidez e simplicidade. 
O sistema recebe uma URL longa informada pelo usuário e a converte em um código curto (atualmente gerado pelo NanoID - ex: `a1b2c3`).
Esses links são armazenados em um banco de dados **Supabase (PostgreSQL)**. 
Quando o usuário acessa o site com o link curto (ex: `linkfly.app.br/a1b2c3`), o backend intercepta a requisição, busca o registro correspondente no banco de dados e realiza um redirecionamento HTTP 302/301 para a URL original.

## 2. Paleta de Cores e Interface (UI/UX)
- **Background Principal:** `#e9f5ff` (Azul bem claro, transmite segurança e limpeza)
- **Acento/Primária (Botões, Bordas):** `#20daa9` (Verde/Teal vibrante, chama para a ação)
- **Hover na Cor Primária:** `#17b590` (Teal mais escuro, feedback visual imediato)
- **Cor do Texto Base:** `#333333` (Cinza escuro para alto contraste e legibilidade)
- **Formas e Estilo:** Bordas arredondadas (radius de 8px e 12px), sombras suaves (box-shadow) para sensação tátil e profundidade (`rgba(0, 0, 0, 0.1)`). Elementos responsivos, organizados em display `flex` (flex-box) e centralizados. Fonte principal: `"Helvetica Neue", sans-serif`.

## 3. Arquitetura Padrão (MVC + DTO)
O projeto utilizará a arquitetura **Model-View-Controller (MVC)** com transferências de dados limitadas por **DTOs (Data Transfer Objects)**.
- **Model:** Classes/Schemas que representam a estrutura de dados e fazem o acesso ao banco (Supabase).
- **View:** A interface web estática/dinâmica que interage com o usuário (HTML/CSS mantidos em `/public`).
- **Controller:** Lógica de negócio que valida requisições, manipula os Models e retorna respostas ao cliente.
- **DTO:** Objetos criados para transportar dados de forma validada (ex: `CreateShortLinkDTO`), escondendo dados sensíveis das requisições e respostas e sanitizando entradas.

## 4. Modelo de Entidade e Relacionamento (MER)

Baseado no funcionamento, foi criada uma estrutura contendo Tabela de Links e Tabela de Usuários (para suportar propriedade de links, restrições e análises futuras):

### Entidade `profiles` (Usuários / Clientes)
- Representa os usuários do sistema.
- Chave Primária: `id` (UUID - vinculado ao auth.users do Supabase)
- Relacionamentos: 1 Usuário pode ter N Links.

### Entidade `links` (URLs Encurtadas)
- Representa as URLs criadas no sistema.
- Chave Primária: `id` (UUID)
- Chave Estrangeira: `user_id` (UUID - Referencia `profiles.id`)
- Regras: `short_code` deve ser ÚNICO para que não haja colisão entre os encurtamentos.

### Entidade `link_clicks` (Analytics/Estatísticas) - *Opcional*
- Representa os cliques que um link recebe, para analises mais complexas.
- Chave Primária: `id` (UUID)
- Chave Estrangeira: `link_id` (UUID - Referencia `links.id`)

*(Veja os arquivos SQL e migrations correspondentes ao banco de dados).*

## 5. Diretrizes Rigorosas de Segurança (Data Leak Rules)
1. **Nenhum Dado Sensível Hardcoded:** Todas as chaves do Supabase, DB Strings e afins devem ser lidas exclusivamente de arquivos `.env`.
2. **Nenhuma Exposição em Cliente:** O banco de dados Supabase tem a `anon_key` (Publishable Key), mas a `service_role_key` JAMAIS deve ir para a aplicação frontend e tampouco subir no Git.
3. **Tratamento de Exceções:** Retornos de erro da API (500) não devem expor rastros de pilha (stack traces) nem a query SQL original falha. Responder apenas erros genéricos ou padronizados.

---
**IMPORTANTE PARA A IA (RULES/SKILLS):** Antes de executar qualquer ação, a IA deve IMPRETERIVELMENTE consultar as regras aqui estabelecidas e os arquivos `.rules` e `.skills` do projeto na pasta `.agent`. Esta é a fonte absoluta de verdade da arquitetura e operação.
