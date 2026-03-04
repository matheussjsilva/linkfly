-- Supabase PostgreSQL Setup Script para LinkFly
-- Criação do Schema 'linkfly' e de todas as estruturas do MER.

-- 1. Criação do Schema
CREATE SCHEMA IF NOT EXISTS linkfly;

-- Setar o search_path para usar o novo schema temporariamente ou explicitamente nos objetos.
-- A recomendação em Supabase/PostgREST é manter as tabelas em 'public' para acesso anon/authenticated,
-- MAS, conforme solicitado, vamos criar no schema 'linkfly' e você deve conceder as permissões adequadas
-- no PostgREST se quiser acesso via API diretamente a esse schema.
-- Aqui, por simplicidade, setaremos o search_path
SET search_path TO linkfly, public;

-- 2. Habilitar extensões necessárias caso não estejam
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Criação da Tabela 'profiles' (Usuários do sistema vinculados ao auth do Supabase)
-- Se você usa Supabase Auth, o ID geralmente é o mesmo id do auth.users (gen_random_uuid).
CREATE TABLE IF NOT EXISTS linkfly.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Criação da Tabela 'links' (Relação de M para 1 com profiles)
CREATE TABLE IF NOT EXISTS linkfly.links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES linkfly.profiles(id) ON DELETE CASCADE, -- NULL se for anônimo (opcional)
    original_url TEXT NOT NULL CHECK (original_url ~ '^https?://.*'),
    short_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE, -- Opcional: data de validade do link
    is_active BOOLEAN DEFAULT TRUE
);

-- Index para busca rápida pelo short_code, já que será a query mais frequente (verificação de URL e Redirecionamento)
CREATE INDEX IF NOT EXISTS idx_links_short_code ON linkfly.links(short_code);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON linkfly.links(user_id);

-- 5. Criação da Tabela 'link_clicks' para estatísticas
CREATE TABLE IF NOT EXISTS linkfly.link_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID NOT NULL REFERENCES linkfly.links(id) ON DELETE CASCADE,
    ip_address INET, -- Guardar IP do clique (cuidado com LGPD, pode pseudo-anonimizar)
    user_agent TEXT, -- Browser e OS do usuário que clicou
    referer TEXT, -- De onde o clique veio
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index de Analytics
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON linkfly.link_clicks(link_id);

-- 6. Trigger para atualizar updated_at automaticamente na profiles
CREATE OR REPLACE FUNCTION linkfly.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON linkfly.profiles
    FOR EACH ROW
    EXECUTE PROCEDURE linkfly.update_modified_column();

-- 7. Configuração de RLS (Row Level Security) - Basic Setup
ALTER TABLE linkfly.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkfly.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkfly.link_clicks ENABLE ROW LEVEL SECURITY;

-- Exemplo RLS: Usuário só pode ver/modificar seu próprio profile
CREATE POLICY "Users can view own profile" 
    ON linkfly.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON linkfly.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Exemplo RLS: Links - Se for público, todo mundo pode ler (para o redirecionamento funcionar)
-- Mas para *criar*, talvez precise estar logado, ou se for anônimo, lidamos na API (Service Role)
CREATE POLICY "Anyone can redirect links" 
    ON linkfly.links FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Users can manage own links" 
    ON linkfly.links FOR ALL 
    USING (auth.uid() = user_id);

-- Exemplo RLS: Clicks (Geralmente lidado pelo backend/Service Role, mas se for direto:)
CREATE POLICY "Users can view clicks of their links"
    ON linkfly.link_clicks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM linkfly.links l 
            WHERE l.id = link_clicks.link_id 
              AND l.user_id = auth.uid()
        )
    );

-- Nota: Como o sistema foi descrito como tendo a lógica no Backend (Node.js/Express)
-- É vital que o Backend utilize o SUPABASE SERVICE ROLE KEY ou o ANON KEY + Access Token (JWT) do usuário
-- para realizar as operações, garantindo que o RLS seja aplicado ou ignorado dependendo da estratégia (DTO na Edge/Controller).
