# Verificação da versão 3.1.0

Em 5 de outubro de 2026:

- 59 testes de lógica, execução e abertura do popup passaram, com DOM e respostas de rede fictícios.
- Prévia, cache reutilizado, mais de 500 ações, autorização, troca de conta, trava entre abas, interrupção de autenticação, respostas ambíguas, erro de armazenamento, HTTP 429, pausa durante espera e parada foram verificados.
- Bookmarks e likes usam apenas suas próprias operações, inclusive em posts da própria conta. Página errada, confirmação de outro modo ou cache com tipo de operação errado não enviam requisições. Históricos, pendentes e prévias são independentes; likes/bookmarks marcados novamente continuam elegíveis.
- O filtro adulto exige aviso de mídia explícito em português/inglês e não reconhece aviso genérico, texto de post, citação ou título sem controle Show. Cache geral não entra no filtro e cache filtrado sem indicação de classificação é rejeitado. A confirmação inclui ADULTOS e o filtro fica bloqueado durante a execução.
- Na demonstração local, a prévia geral identificou três likes e enviou zero alterações. A prévia filtrada identificou apenas um dos três itens, com aviso fictício, e enviou zero alterações. Depois, uma única remoção simulada foi enviada para o ID filtrado. Não havia mídia adulta na demonstração e nenhuma requisição foi enviada ao X.
- O layout foi inspecionado em 1280×800 e 360×760, incluindo Likes e Bookmarks com o filtro ativo. O painel mantém a largura dentro da janela e usa rolagem interna em alturas pequenas. Os controles medidos têm pelo menos 44 px, rótulos associados e foco visível.
- Os arquivos de console, userscript e extensão usam o mesmo motor. Nenhuma demonstração, teste, arquivo pessoal ou relatório faz parte do pacote.
- A nova extensão, suas mutações de likes/bookmarks e a detecção dos avisos adultos ainda não foram testadas contra uma conta real do X. Avisos ocultos ou estruturas não reconhecidas são preservados; os testes não comprovam alcance de todo o histórico. Publicação na loja, pagamento de cadastro e hospedagem da política não foram executados.

## Artefatos locais

- `dist/tweet-cleaner-3.1.0.zip`: pacote de distribuição.
- `dist/tweet-cleaner/`: extensão para instalação sem compactação.
- `artifacts/store/painel-1280x800.png`: captura com dados fictícios identificados.
- `artifacts/store/painel-bookmarks-mobile.png`: janela 360×760 com filtro ativo; a captura retornada pelo navegador mede 345×728.
- `artifacts/store/promo-440x280.png`: imagem promocional original.
- `extension/icons/128.png`: ícone da loja.

Esses materiais não garantem aprovação na Chrome Web Store ou compatibilidade futura dos endpoints internos do X.
