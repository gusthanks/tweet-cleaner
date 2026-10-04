# Ficha da Chrome Web Store

## Nome

Tweet Cleaner

## Descrição curta

Limpe posts, respostas e reposts do X com prévia, pausa e retomada. Gratuito, com progresso salvo localmente.

## Descrição detalhada

O Tweet Cleaner abre um painel no próprio perfil do X para ajudar você a limpar seus posts, respostas e reposts.

- Faça uma prévia sem excluir e reaproveite os IDs encontrados depois.
- Exclua continuamente, sem cotas pagas impostas pela ferramenta.
- Pause, retome ou pare quando precisar.
- Aguarde automaticamente quando o X responder com um limite de requisições.
- Retome usando os IDs salvos no navegador, sem repetir ações concluídas.
- Use opcionalmente o arquivo de dados do X para encontrar posts antigos.
- Exporte um relatório para o seu computador.

Gratuito. Sem anúncios, assinatura ou servidor de coleta do desenvolvedor. A extensão só acessa a aba quando você a invoca; não pede acesso permanente a todos os sites.

A exclusão é permanente e exige confirmação da conta conectada. O painel começa em prévia e não inicia exclusões ao instalar. A página pode omitir posts antigos; uma rodada terminada não garante que todo o histórico foi removido. A extensão precisa da aba aberta e de uma sessão ativa no X. Troque manualmente para as abas Respostas e Reposts para outras rodadas.

Ferramenta independente, sem afiliação com X ou Google. Utiliza endpoints internos do X, sujeitos a mudanças. O X pode restringir automação pela interface. Esperar os limites não elimina o risco de restrição da conta. A ferramenta não remove curtidas, mensagens, seguidores ou dados do perfil.

## Finalidade única

Permitir que o usuário encontre e exclua os próprios posts, respostas e reposts do X, com controle de execução e retomada local.

## Justificativa de permissões

- **activeTab:** acesso temporário à aba invocada pelo usuário para ler links do próprio perfil e mostrar o painel de limpeza.
- **scripting:** injetar o código empacotado do painel nessa aba, em contexto isolado. Não há código remoto ou execução automática em todos os sites.

## Tratamento de dados

Leia a política completa antes de responder ao formulário. São processados localmente o identificador da conta, links/IDs de posts, indicador de repost e os arquivos selecionados. Durante a exclusão, o token CSRF e a sessão do navegador são usados somente para enviar requisições diretamente ao X. IDs de progresso e pendentes ficam no armazenamento da origem do X; relatórios são downloads locais sob ação do usuário. Não há transferência ao desenvolvedor, venda de dados ou analytics.

## Instruções para revisão

1. Use uma conta de teste do X controlada pelo revisor; não é necessário criar conta na extensão.
2. Abra o perfil da conta conectada e invoque a extensão.
3. Clique Abrir painel nesta aba; confirme que a opção Prévia sem apagar começa marcada.
4. Clique Encontrar posts, pare a busca e confirme os contadores. Nenhuma requisição de exclusão é enviada em prévia.
5. Para testar exclusão, publique antes um post descartável na conta de teste. Desmarque a prévia e confirme a frase solicitada. Uma exclusão real não é reversível.
6. Pause/retome/pare e exporte um relatório. Atualize o perfil para conferir o resultado.

Não forneça credenciais pessoais no formulário. O teste ao vivo depende do X; se ele alterar a API ou restringir a sessão, o painel interrompe com uma mensagem em vez de registrar sucesso falso.
