# Verificação da versão 3.0.0

Em 4 de outubro de 2026:

- 34 testes de lógica, execução e abertura do popup passaram, com DOM e respostas de rede fictícios.
- Prévia, cache reutilizado, mais de 500 ações, autorização, troca de conta, trava entre abas, interrupção de autenticação, respostas ambíguas, erro de armazenamento, HTTP 429, pausa durante espera e parada foram verificados.
- Na demonstração local, o painel identificou dois posts e um repost, salvou três IDs e enviou zero exclusões. Os contadores e o estado de parada apareceram corretamente.
- O layout foi inspecionado em 1280×800 e 360×760. O painel mantém a largura dentro da janela e usa rolagem interna em alturas pequenas. Os controles têm rótulos associados e foco visível.
- Os arquivos de console, userscript e extensão usam o mesmo motor. Nenhuma demonstração, teste, arquivo pessoal ou relatório faz parte do pacote.
- A nova extensão ainda não foi instalada ou testada contra uma conta real do X. Publicação na loja, pagamento de cadastro e hospedagem da política não foram executados.

## Artefatos locais

- `dist/tweet-cleaner-3.0.0.zip`: pacote de distribuição.
- `dist/tweet-cleaner/`: extensão para instalação sem compactação.
- `artifacts/store/painel-1280x800.png`: captura com dados fictícios identificados.
- `artifacts/store/promo-440x280.png`: imagem promocional original.
- `extension/icons/128.png`: ícone da loja.

Esses materiais não garantem aprovação na Chrome Web Store ou compatibilidade futura dos endpoints internos do X.
