-- =====================================================
-- PARTIE 1: ENUMS ET TYPES
-- =====================================================

-- Rôles utilisateurs
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'creator');

-- Statut KYC
CREATE TYPE public.kyc_status AS ENUM ('pending', 'submitted', 'verified', 'rejected');

-- Statut abonnement
CREATE TYPE public.subscription_status AS ENUM ('pending', 'active', 'expired', 'cancelled');

-- Type d'abonnement
CREATE TYPE public.subscription_tier AS ENUM ('daily', 'biweekly', 'monthly', 'enterprise');

-- Statut match
CREATE TYPE public.match_status AS ENUM ('scheduled', 'live', 'finished', 'postponed', 'cancelled');

-- Statut ticket
CREATE TYPE public.ticket_status AS ENUM ('pending', 'active', 'match_finished', 'won', 'lost', 'paid_out', 'cancelled', 'expired');

-- Tier de prix ticket
CREATE TYPE public.ticket_price_tier AS ENUM ('basic', 'standard', 'premium');

-- Statut pari personnel
CREATE TYPE public.personal_bet_status AS ENUM ('pending', 'active', 'won', 'lost', 'cancelled');

-- Statut commission
CREATE TYPE public.commission_status AS ENUM ('pending', 'paid', 'cancelled');

-- =====================================================
-- PARTIE 2: TABLES UTILISATEURS ET RÔLES
-- =====================================================

-- Table des rôles utilisateurs
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Table KYC pour les créateurs
CREATE TABLE public.creator_kyc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT NOT NULL,
    id_number TEXT NOT NULL,
    id_front_url TEXT,
    id_back_url TEXT,
    selfie_url TEXT,
    phone_number TEXT NOT NULL,
    address TEXT,
    status kyc_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_kyc ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PARTIE 3: ABONNEMENTS
-- =====================================================

-- Prix des abonnements
CREATE TABLE public.subscription_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier subscription_tier NOT NULL UNIQUE,
    price BIGINT NOT NULL,
    duration_days INTEGER NOT NULL,
    can_print_tickets BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_prices ENABLE ROW LEVEL SECURITY;

-- Abonnements des créateurs
CREATE TABLE public.creator_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL,
    status subscription_status NOT NULL DEFAULT 'pending',
    price_paid BIGINT NOT NULL,
    transaction_id UUID REFERENCES public.transactions(id),
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PARTIE 4: SPORTS ET MATCHS
-- =====================================================

-- Compétitions
CREATE TABLE public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE,
    name TEXT NOT NULL,
    country TEXT,
    logo_url TEXT,
    season TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

-- Équipes
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE,
    name TEXT NOT NULL,
    short_name TEXT,
    logo_url TEXT,
    country TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Matchs
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE,
    competition_id UUID REFERENCES public.competitions(id),
    home_team_id UUID REFERENCES public.teams(id),
    away_team_id UUID REFERENCES public.teams(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    status match_status NOT NULL DEFAULT 'scheduled',
    home_score INTEGER,
    away_score INTEGER,
    odds_home DECIMAL(6,2),
    odds_draw DECIMAL(6,2),
    odds_away DECIMAL(6,2),
    result TEXT,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PARTIE 5: TICKETS ET PRONOSTICS
-- =====================================================

-- Tickets des créateurs
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price_tier ticket_price_tier NOT NULL,
    price BIGINT NOT NULL,
    potential_gain BIGINT NOT NULL,
    total_odds DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    status ticket_status NOT NULL DEFAULT 'pending',
    is_physical BOOLEAN NOT NULL DEFAULT false,
    physical_code TEXT UNIQUE,
    verification_code TEXT UNIQUE,
    max_purchases INTEGER,
    current_purchases INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    result_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Sélections/lignes du ticket
CREATE TABLE public.ticket_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    match_id UUID NOT NULL REFERENCES public.matches(id),
    prediction TEXT NOT NULL,
    odds DECIMAL(6,2) NOT NULL,
    is_correct BOOLEAN,
    result_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_selections ENABLE ROW LEVEL SECURITY;

-- Achats de tickets
CREATE TABLE public.ticket_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id),
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    price_paid BIGINT NOT NULL,
    stake_amount BIGINT NOT NULL,
    potential_gain BIGINT NOT NULL,
    actual_gain BIGINT,
    transaction_id UUID REFERENCES public.transactions(id),
    status ticket_status NOT NULL DEFAULT 'pending',
    is_physical_purchase BOOLEAN NOT NULL DEFAULT false,
    physical_code_used TEXT,
    gain_paid BOOLEAN NOT NULL DEFAULT false,
    gain_paid_at TIMESTAMPTZ,
    creator_commission BIGINT,
    creator_commission_paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_purchases ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PARTIE 6: PARIS PERSONNELS
-- =====================================================

-- Paris personnels des utilisateurs
CREATE TABLE public.personal_bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    stake_amount BIGINT NOT NULL,
    potential_gain BIGINT NOT NULL,
    total_odds DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    status personal_bet_status NOT NULL DEFAULT 'pending',
    actual_gain BIGINT,
    result_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.personal_bets ENABLE ROW LEVEL SECURITY;

-- Sélections des paris personnels
CREATE TABLE public.personal_bet_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_bet_id UUID NOT NULL REFERENCES public.personal_bets(id) ON DELETE CASCADE,
    match_id UUID NOT NULL REFERENCES public.matches(id),
    prediction TEXT NOT NULL,
    odds DECIMAL(6,2) NOT NULL,
    is_correct BOOLEAN,
    result_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.personal_bet_selections ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PARTIE 7: COMMISSIONS ET VÉRIFICATIONS
-- =====================================================

-- Commissions des créateurs
CREATE TABLE public.creator_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ticket_purchase_id UUID NOT NULL REFERENCES public.ticket_purchases(id),
    amount BIGINT NOT NULL,
    commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.01,
    status commission_status NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    transaction_id UUID REFERENCES public.transactions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_commissions ENABLE ROW LEVEL SECURITY;

-- Vérifications de tickets physiques
CREATE TABLE public.physical_ticket_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_code TEXT NOT NULL,
    is_valid BOOLEAN NOT NULL DEFAULT false,
    verification_message TEXT,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.physical_ticket_verifications ENABLE ROW LEVEL SECURITY;

-- Statistiques des créateurs
CREATE TABLE public.creator_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_tickets_created INTEGER NOT NULL DEFAULT 0,
    total_tickets_sold INTEGER NOT NULL DEFAULT 0,
    total_revenue BIGINT NOT NULL DEFAULT 0,
    total_commissions_earned BIGINT NOT NULL DEFAULT 0,
    win_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    total_wins INTEGER NOT NULL DEFAULT 0,
    total_losses INTEGER NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    total_ratings INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_stats ENABLE ROW LEVEL SECURITY;