# Pesquisa sobre fornecedores — 2026-10-03

Consulta a documentação pública dos fornecedores; nenhum código proprietário foi extraído ou execução paga realizada.

- [TweetDelete FAQ](https://tweetdelete.net/faq/): anuncia 500 tweets/likes por mês no plano Pro. É cota de assinatura, não teto de segurança por execução. Descreve tarefas, contadores, importação de arquivo, autorização de acesso revogável, limite de requisições e interrupção quando há muitos erros.
- [TweetDelete extensão oficial](https://chromewebstore.google.com/detail/tweetdelete-%E2%80%93-delete-twee/aifggeijadkgmindifghoaefhgjjklkh): anuncia prévia, tarefas em segundo plano e acompanhamento de progresso. A descrição não especifica o intervalo exato entre exclusões.
- [TweetDeleter FAQ](https://tweetdeleter.com/faq/): informa autorização para recuperar posts pela API do X. O comportamento de um serviço autorizado via API não pode ser assumido equivalente a um script no console do site.
- [DeleteTweets extensão](https://chromewebstore.google.com/detail/deletetweets-bulk-delete/mppblpedoemekekejafmcopafmkagkic): descreve exclusão em massa, mas a página pública não demonstra que 500 por execução seja uma recomendação do X nem revela a implementação exata de pacing.
- [Regras do X](https://help.x.com/en/rules-and-policies/x-automation): alertam contra automação não baseada na API oficial, como scripting do site, e contra contornar limites. Scripts que chamam endpoints internos do web client não possuem garantia de aceitação ou de ausência de suspensão.

Conclusão de engenharia: 500 serve como limite de trabalho escolhido pelo usuário. Controle de lote, prévia reaproveitável, retomada, execução sequencial, respeito ao rate limit e parada em erros melhoram o controle; não são prova de conformidade nem garantia de segurança da conta. Sem documentação pública, não se afirma que nosso ritmo seja igual ao das extensões.
