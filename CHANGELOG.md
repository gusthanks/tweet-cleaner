# Mudanças

## 2.1.0

- Teto de 500 itens e 500 requisições por execução, contando novas tentativas.
- Simulação para em 500 IDs e salva os pendentes localmente; parar antes também conserva a lista.
- Botão Excluir lote salvo usa os IDs já encontrados sem repetir a varredura.
- Cache separado por conta, aba e modo, preservado após atualizar a página.
- Falhas ficam pendentes; sucessos são retirados da lista; próximo lote requer início manual.
- Aviso explícito sobre o risco de suspensão por automação do site.
- Testes com mais de 500 entradas, teto com retries, cache após recarga e interrupção parcial.

## 2.0.0

- Painel em português com simulação, confirmação por conta, pausa, parada e relatório.
- Retomada por IDs concluídos, separada por conta e tipo de ação.
- Arquivos divididos e deduplicação, sem execução de código do arquivo.
- Mantém IDs como strings para preservar precisão.
- Trava contra execuções concorrentes e identificação obrigatória da conta.
- Correção: HTTP 404 não significa automaticamente post já apagado.
- Correção: resposta JSON ausente/ambígua não é considerada sucesso.
- Espera de rate limit respeita o reset completo; tentativas de rede/servidor limitadas.
- Interrupção em erros de autenticação ou incompatibilidade da API.
- Userscript gerado pela mesma base, iniciado manualmente.
- Testes de lógica e execução com respostas simuladas.

Compatibilidade ao vivo com o X ainda não verificada. O modo de página não garante exclusão de posts antigos que o X não carrega.
