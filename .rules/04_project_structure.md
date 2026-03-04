---
name: Project Structure and Architecture (MVC + DTO)
description: Regras vitais para manter e cuidar da estrutura das pastas, utilizando M-V-C e Modelos DTO para dados.
---
# Arquitetura do Projeto: MVC + DTO (Padrão de Qualidade)

É vital manter e cuidar da estrutura e organização das pastas ao escalar o projeto. O projeto foi definido e deve evoluir utilizando a arquitetura Model-View-Controller (MVC) auxiliada por Data Transfer Objects (DTO).

## 1. O Padrão MVC

*   **Models (/src/models)**
    *   Arquivos aqui não tratam lógicas de negócios complexas nem regras do Express (Request/Response).
    *   Eles cuidam exclusivamentede de modelar e centralizar a manipulação dos dados com o Supabase. Classes, instâncias do Supabase client limitadas ou tipos em TS/JS definindo a Entidade `links` ou `profiles`.
*   **Views (/public ou /src/views se migrar para Server-Side Rendering como EJS)**
    *   Todo HTML, CSS estático e JS de front-end fica aqui.
    *   A view nunca deve acessar o banco de dados diretamente, devendo sempre consultar os Controllers através de API REST (`/api/v1/...`).
*   **Controllers (/src/controllers)**
    *   Recebe as requisições, faz a orquestração e aciona o banco via Models.
    *   Manipula os objetos de entrada e saída.

## 2. Roteamento Dedicado
*   **Routes (/src/routes)**: Controllers não devem definir caminhos do express. As definições como `app.post('/shorten', Controller.encurtarLink)` devem estar concentradas em pastas e arquivos específicos de rotas (ex: `linkRoutes.js`).

## 3. Data Transfer Objects (DTO) Trafegando Dados
NUNCA pegue um objeto que vem direto de `req.body` e envie ele para um `Model.create()`. **ISSO CAUSA VULNERABILIDADES (Injection, Mass Assignment).**

*   **DTOs (/src/dtos)**
    *   Sempre valide e filtre os dados. A IA deve sugerir um DTO.
    *   Exemplo de DTO de Entrada: `CreateLinkDTO`. Um arquivo/classe onde extrai-se APENAS `{ original_url: req.body.url }`. Campos adicionais enviados maliciosamente no payload do JSON pelo usuário serão desconsiderados.
    *   Exemplo de DTO de Saída: O model retorna o profile do banco que inclui senhas criptografadas (ou algo semelhante). O `ProfileResponseDTO` garante que retornamos apenas: `{ id, nome, email }`. NUNCA repasse a estrutura do banco crua!

## Regras de Atuação (IA)
A IA não tem permissão para achatar (flat) o projeto colocando controladores e regras do banco misturadas no `index.js`. Ao sugerir modificações, você DEVE propor a criação dos diretórios acima, isolar os scripts de cada camada e usar exportação e importação de módulos (`import` / `export`).
