---
name: Palette and Style Definition
description: Define a paleta de cores estrita e as diretrizes de estilização visual do projeto.
---
# Diretrizes de Paleta de Cores e Estilo Visual

## 1. Paleta de Cores
O projeto conta com uma paleta de cores definida e imutável. NÃO UTILIZE cores que fujam deste padrão a menos que explicitamente solicitado pelo usuário, alterando este arquivo.

*   **Background Principal:** `#e9f5ff` (Azul claro - transmite segurança, limpeza e leveza).
*   **Cor Primária / Acento (Botões, Bordas, Destaques):** `#20daa9` (Teal/Verde vibrante - focado em Call to Action).
*   **Cor Primária (Hover / Interação):** `#17b590` (Teal escuro - usado para dar feedback de interação tátil).
*   **Cor de Texto Base:** `#333333` (Cinza muito escuro - usado para textos em geral, garantindo alto contraste e acessibilidade contra fundos claros e brancos).
*   **Cor de Fundo de Containers (Cards, Forms):** `#ffffff` (Branco puro).
*   **Cor de Bordas Secundárias (Inputs):** `#dddddd`

## 2. Tipografia
*   **Fonte Principal:** `"Helvetica Neue", sans-serif`. Nunca utilize fontes serifadas para a UI principal.
*   **Tamanhos:** Mantenha legibilidade (16px base para inputs e botões). 

## 3. Formas, Sombras e Transições
*   **Bordas Arredondadas (Border Radius):** Utilize `8px` para elementos menores (inputs, botões) e `12px` para containers principais. Não utilize cantos totalmente retos (0px) nem pílulas exageradas, a menos que seja um badge específico.
*   **Sombras (Box-shadow):** O design utiliza sombras suaves para criar profundidade e a sensação de que os elementos flutuam (`0 10px 20px rgba(0, 0, 0, 0.1)`).
*   **Transições (Micro-Interações):** Elementos interativos (botões, cards) devem ter transições suaves (ex: `transition: transform 0.3s ease, box-shadow...`).
*   **Hover em Cards:** Utilize elevação (`transform: translateY(-5px)`) aliada ao escurecimento/aumento da sombra.

## Regras de Atuação (IA)
*   **NÃO** inclua frameworks de CSS como Bootstrap ou Tailwind a menos que a arquitetura futura exija e o `consulta.md` seja atualizado. O projeto atual utiliza CSS Puro (`styles.css`).
*   **SEMPRE** que criar um novo componente visual (ex: modal, toast, novo form), utilize as variáveis hexadecimais acima.
