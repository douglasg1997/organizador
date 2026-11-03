# Auditoria e revisão dos fluxos

Revisão de 03/11/2026. Diagnóstico baseado em inspeção do código e testes de interface com dados fictícios, sem observar comportamento real de usuários. As melhorias abaixo são hipóteses de usabilidade implementadas; não são resultados de um teste comparativo de produtividade.

| Fluxo | Atrito identificado | Mudança aplicada |
|---|---|---|
| Capturar tarefa | Modal com muitos campos mesmo para um lembrete simples | Campo permanente; título e Enter salvam. Prévia de projeto, prioridade e datas antes do envio |
| Reagendar | Abrir edição, localizar data, alterar e salvar | Ações Hoje e Amanhã na lista, com Desfazer por 12 segundos |
| Alterar situação | Abrir edição fora do quadro | Seletor direto na lista e no quadro, com Desfazer |
| Acessar tarefas de projeto | Cartão abria edição e só então oferecia tarefas | Ver tarefas e + Tarefa diretamente no projeto; edição separada |
| Repetir trabalho | Redigitar os dados de uma tarefa semelhante | Usar tarefa concluída como modelo, revisar e salvar; datas de entrega não são copiadas |
| Detalhar tarefa | Aproximadamente nove campos e checklist simultâneos | Três grupos: Tarefa, Planejamento, Notas e etapas. Salvar disponível sem percorrer todos |
| Filtrar | Três seletores sempre visíveis, sobretudo no celular | Busca visível e demais filtros sob controle expansível, com indicação da quantidade ativa |
| Navegar no celular | Menu horizontal escondia destinos | Seis destinos em grade com rótulos |
| Identidade visual | Frases motivacionais, fontes externas, verdes suaves e cartões grandes | Tipografia de sistema, base neutra, azul para ações, indicadores compactos e texto operacional |

## Captura de intenção

O app aplica atalhos determinísticos, com resultado visível antes de salvar. Não há modelo generativo, monitoramento de cliques ou serviço adicional.

Exemplo: `Revisar boletim amanhã !alta #cisc` → título Revisar boletim, prioridade Alta, trabalho no dia seguinte, projeto CISC se existir.

- `hoje`, `amanhã` e `depois de amanhã` no fim planejam o dia de trabalho.
- `até DD/MM/AAAA` define o prazo; sem ano, usa o ano atual. A prévia mostra a data resultante. Datas inválidas bloqueiam o envio.
- `!urgente`, `!alta`, `!media` e `!baixa` definem a prioridade.
- `#slug-do-projeto` associa somente projetos já existentes. Atalhos desconhecidos permanecem no título.
- O filtro de projeto preenche o projeto por contexto. Na visão Meu dia, o planejamento inicial é hoje.
- Uma tarefa urgente não planejada para hoje pode ser sugerida para hoje; uma tarefa concluída recente pode ser oferecida como modelo. A sugestão explica sua origem e nunca salva sozinha.

## Organização das informações

Aplicou-se agrupamento e revelação progressiva, sem tratar a Lei de Miller como um número obrigatório de itens por tela. Os campos são organizados pelo objetivo, e os dados permanecem preenchidos ao trocar de grupo. Projetos usam cartões com dados relevantes; tarefas usam linhas para comparação e ações rápidas.

## Validação e limites

Oito testes automatizados cobrem filtros, datas locais, calendário bissexto, escape de texto e interpretação da captura, incluindo datas impossíveis e termos desconhecidos. A prévia usa dados fictícios separados do Supabase para verificar captura, reagendamento com Desfazer, troca de grupos e salvamento de checklist. A largura de 390 px é verificada em uma prévia de celular. Login e sincronização continuam usando a integração já existente. Nenhuma alteração de esquema ou de dados do usuário é necessária.

Não há criação automática de recorrências; Repetir cria um novo rascunho que precisa ser salvo. Não há interpretação livre de qualquer frase: use os atalhos descritos e confira a prévia. A medição de eficácia com uso real ainda não foi realizada.


## Revisão visual e estados da interface

- Hierarquia de navegação com ícones SVG consistentes, indicação da área atual e cores neutras com azul de ação.
- Editor em painel lateral; no celular ocupa a tela e mantém ações de salvar/cancelar acessíveis no rodapé.
- Menu móvel recolhível com fechamento por seleção, fundo ou Escape, retorno de foco e conteúdo de fundo inativo enquanto aberto.
- Carregamento inicial com skeleton, sem confundir ausência de dados com contagem zero.
- Falha de atualização com mensagem persistente e Tentar novamente; os dados já carregados permanecem na tela.
- Estados vazios com ação de criar tarefa/projeto ou limpar filtros.
- Controles principais com área de toque de 44 px no celular; checkbox com área adicional ao redor, foco visível e respeito à preferência de movimento reduzido.
- Validação em prévia com dados fictícios: desktop, largura móvel de 390 px, painel de edição, estado de erro e skeleton. Não constitui auditoria completa de conformidade WCAG.


## Direção visual revista

O painel Meu dia passou a ter uma composição em duas colunas: tarefas e captura na coluna principal, próximas entregas e resumo dos projetos na lateral. Essas informações são calculadas somente a partir dos dados da conta: as próximas quatro entregas futuras ou do dia, excluindo tarefas concluídas, e até três projetos com sua proporção de tarefas concluídas. Sem registros, os painéis oferecem orientações e ações de criação.

A identidade usa navegação azul-escura, superfície clara quente e terracota para ações. Indicadores ganharam hierarquia numérica; quadros, projetos, login e painel de edição foram redesenhados no mesmo sistema. No celular, o conteúdo vira uma coluna e os resumos seguem após as tarefas. Os estados de carregamento, erro, foco e preferência por movimento reduzido foram mantidos.
