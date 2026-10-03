# Mudanças

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
