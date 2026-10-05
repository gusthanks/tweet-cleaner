# Ficha da Chrome Web Store

## Nome

Tweet Cleaner

## Descrição curta

Limpe posts, reposts, bookmarks e likes do X com prévia, pausa e retomada. Gratuito, com progresso salvo localmente.

## Descrição detalhada

O Tweet Cleaner abre um painel no X para ajudar você a limpar seus posts, respostas e reposts ou retirar bookmarks e likes.

- Faça uma prévia sem excluir e reaproveite os IDs encontrados depois.
- Exclua continuamente, sem cotas pagas impostas pela ferramenta.
- Pause, retome ou pare quando precisar.
- Aguarde automaticamente quando o X responder com um limite de requisições.
- Retome usando os IDs salvos no navegador, sem repetir ações concluídas.
- Use opcionalmente o arquivo de dados do X para encontrar posts antigos.
- Escolha Bookmarks ou Likes para retirar salvos ou curtidas sem apagar os posts.
- Opcionalmente filtre likes/bookmarks por avisos explícitos de conteúdo adulto exibidos pelo X em português ou inglês. Sem rótulo reconhecido, o item é preservado; avisos genéricos de conteúdo sensível não bastam.
- Exporte um relatório para o seu computador.

Gratuito. Sem anúncios, assinatura ou servidor de coleta do desenvolvedor. A extensão só acessa a aba quando você a invoca; não pede acesso permanente a todos os sites.

A exclusão de posts é permanente. Cada modo exige confirmação da ação e da conta conectada. O painel começa em prévia e não inicia alterações ao instalar. A página pode omitir itens antigos; uma rodada terminada não garante que todo o histórico foi removido. A extensão precisa da aba aberta e de uma sessão ativa no X. Troque manualmente para Respostas, Reposts, Likes ou a página Bookmarks conforme a limpeza escolhida. Pastas de bookmarks não são atendidas.

Ferramenta independente, sem afiliação com X ou Google. Utiliza endpoints internos do X, sujeitos a mudanças. O X pode restringir automação pela interface. Esperar os limites não elimina o risco de restrição da conta. A ferramenta não remove mensagens, seguidores ou dados do perfil.

## Finalidade única

Permitir que o usuário limpe o histórico da própria conta no X: posts, respostas, reposts, likes e bookmarks, com controle de execução e retomada local.

## Justificativa de permissões

- **activeTab:** acesso temporário à aba invocada pelo usuário para identificar a conta conectada, ler os links e marcadores do perfil, Likes ou Bookmarks e mostrar o painel de limpeza.
- **scripting:** injetar o código empacotado do painel nessa aba, em contexto isolado. Não há código remoto ou execução automática em todos os sites.

## Tratamento de dados

Leia a política completa antes de responder ao formulário. São processados localmente o identificador da conta, links/IDs de posts, indicadores de repost, like e bookmark e os arquivos selecionados. Durante a limpeza, o token CSRF e a sessão do navegador são usados somente para enviar requisições diretamente ao X. IDs de progresso e pendentes ficam no armazenamento da origem do X, separados por conta e modo; relatórios são downloads locais sob ação do usuário. Não há transferência ao desenvolvedor, venda de dados ou analytics.

O filtro adulto lê avisos de mídia na página e registra apenas a indicação de classificação nos IDs pendentes. Não abre imagens/vídeos, não avalia o texto do post e não usa IA. A lista filtrada é separada da limpeza geral. Se o aviso não estiver exibido ou não for reconhecido, o filtro não altera o item. Esses dados podem revelar interesses pessoais; considere isso ao preencher as declarações de privacidade.

## Instruções para revisão

1. Use uma conta de teste do X controlada pelo revisor; não é necessário criar conta na extensão.
2. Abra o perfil da conta conectada e invoque a extensão.
3. Clique Abrir painel nesta aba; confirme que a opção Prévia sem apagar começa marcada.
4. Clique Encontrar posts, pare a busca e confirme os contadores. Nenhuma requisição de exclusão é enviada em prévia.
5. Para testar exclusão, publique antes um post descartável na conta de teste. Desmarque a prévia e confirme a frase solicitada. Uma exclusão real não é reversível.
6. Pause/retome/pare e exporte um relatório. Atualize o perfil para conferir o resultado.
7. Curta e salve um post descartável. Abra a aba Likes do próprio perfil ou a página principal Bookmarks e invoque a extensão. O modo correspondente deve ser selecionado automaticamente. Faça uma prévia e verifique que nenhuma alteração ocorre.
8. Desmarque a prévia e confirme a frase específica para remover likes ou bookmarks. Atualize a página e confirme que a interação foi retirada, mas o post continua acessível. Repita no outro modo. Os históricos e pendentes devem ser independentes do modo de posts.
9. Para verificar o filtro, marque Somente conteúdo adulto e faça uma prévia de itens com e sem o aviso explícito do X em português ou inglês. Itens sem o aviso, com aviso genérico ou com texto semelhante dentro do post/citação devem ser preservados. Nenhuma mídia é aberta. A confirmação de remoção filtrada inclui ADULTOS; dados de demonstração não substituem o teste real.

Não forneça credenciais pessoais no formulário. O teste ao vivo depende do X; se ele alterar a API ou restringir a sessão, o painel interrompe com uma mensagem em vez de registrar sucesso falso.
