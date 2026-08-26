-- supabase-schema.sql
-- Rode este script no SQL Editor do seu projeto Supabase (Project → SQL Editor → New query)
-- pra criar a tabela de leads do quiz "Qual é o seu Presidente Ideal?".
--
-- Este arquivo não é usado em tempo de execução pelo site — é só o script de setup
-- que você roda uma vez no painel do Supabase.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  email text,
  resultado text not null,
  -- Resposta completa (texto da alternativa) das perguntas 1 e 2 do quiz — os dados
  -- de qualificação de lead que mais interessam pro negócio.
  onde_mora text,
  situacao_trabalho text,
  criado_em timestamptz not null default now()
);

-- Habilita Row Level Security: sem isso, qualquer policy abaixo é ignorada.
alter table public.leads enable row level security;

-- Permite que QUALQUER visitante do site (papel "anon", já que não há login)
-- insira um lead. É a única permissão concedida.
create policy "Permitir insercao publica de leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- Propositalmente NÃO existe policy de SELECT/UPDATE/DELETE para o papel "anon".
-- Isso significa que, mesmo com a anon key exposta no navegador (inevitável em app
-- 100% client-side), ninguém consegue ler, editar ou apagar os leads pelo site.
-- Pra consultar os dados, use o Table Editor ou o SQL Editor do painel do Supabase
-- (autenticado com sua conta, que não passa pelas regras de RLS do papel "anon").
