# Organizador

Organizador pessoal de projetos e tarefas, em português, responsivo e compatível com GitHub Pages. Dados e autenticação no Supabase.

## Recursos

- Meu dia: tarefas planejadas para hoje, vencendo hoje e atrasadas.
- Lista com busca e filtros por projeto, prioridade e situação.
- Quadro com mudança de situação e calendário mensal com planejamento e entrega.
- Projetos com descrição, cor, prazo e progresso.
- Tarefas com notas, próxima ação e checklist.
- Login, cadastro, recuperação de senha e exportação JSON.
- Tema claro/escuro. Atualização ao voltar à aba, manualmente e a cada minuto enquanto aberta.

## Publicar no GitHub Pages

Em **Settings → Pages → Build and deployment**, selecione **Deploy from a branch**, branch **main**, pasta **/(root)** e clique **Save**.

Endereço esperado após o GitHub concluir a publicação: https://douglasg1997.github.io/organizador/

## Configurar URLs de autenticação

No projeto Supabase, vá em **Authentication → URL Configuration**:

- Site URL: `https://douglasg1997.github.io/organizador/`
- Redirect URLs: adicione `https://douglasg1997.github.io/organizador/`

Crie sua conta pelo aplicativo usando e-mail e uma senha com pelo menos 8 caracteres. Confirme o e-mail e entre com a mesma conta nos outros dispositivos. A conta do app é separada da conta administrativa do Supabase. O envio de e-mails depende da configuração e dos limites de Auth do projeto; o serviço SMTP padrão pode restringir destinatários aos membros da organização. Para outros usuários, configure SMTP próprio.

## Dados e segurança

As tabelas `public.org_projects` e `public.org_tasks` já foram criadas no projeto Supabase configurado em `app.js`. `schema.sql` documenta a estrutura inicial; **não execute novamente no mesmo projeto**.

As políticas RLS limitam acesso ao proprietário (`auth.uid() = user_id`). Usuários sem login não têm acesso às tabelas. O vínculo tarefa-projeto inclui a conta para impedir referências entre proprietários. Atualizações usam `updated_at` para detectar edições simultâneas e pedir revisão em vez de sobrescrever silenciosamente.

O código contém somente a URL do projeto e a chave **publicável**, apropriada para navegador. Nunca adicione senha do banco, chave secret ou service_role.

O app precisa de internet para carregar e salvar. Não há edição offline ou anexos nesta versão. Uma falha de salvamento é exibida; o formulário permanece aberto. O backup JSON contém os dados da conta carregados após atualizar, sem credenciais. Guarde-o em um local adequado. Importação automática não está incluída.

Os dados não ficam no GitHub. Exporte backups periodicamente: planos gratuitos podem pausar projetos por inatividade.

## Desenvolvimento

Sem compilação. Sirva a pasta com um servidor estático (ex.: `python -m http.server 8000`) e abra pelo endereço local. Configure esse endereço nos redirects do Supabase se precisar testar confirmação/recuperação.

O cliente Supabase usa a versão fixa `@supabase/supabase-js@2.57.4`, via esm.sh. Fontes externas são opcionais: há fontes de sistema como alternativa. Não há dependências npm para executar os testes.

```sh
npm test
node --check app.js
```

Validação inicial: testes de seleção de tarefas, calendário bissexto, datas locais e escape HTML; teste no banco com duas contas temporárias confirmando isolamento de leitura e bloqueio de escrita/transferência entre contas, revertido ao final; verificação de RLS/grants e auditoria de segurança do Supabase sem alertas.

## Revisão de usabilidade

Veja [AUDITORIA_UX.md](AUDITORIA_UX.md) para os fluxos revisados, a captura rápida, os agrupamentos de campos e os limites da interpretação. A captura não usa IA externa nem altera dados sem confirmação do usuário.
