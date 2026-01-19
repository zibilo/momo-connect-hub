-- =====================================================
-- TRIGGERS DE MISE À JOUR AUTOMATIQUE
-- =====================================================

-- Trigger pour creator_kyc
CREATE TRIGGER update_creator_kyc_updated_at
BEFORE UPDATE ON public.creator_kyc
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour subscription_prices
CREATE TRIGGER update_subscription_prices_updated_at
BEFORE UPDATE ON public.subscription_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour creator_subscriptions
CREATE TRIGGER update_creator_subscriptions_updated_at
BEFORE UPDATE ON public.creator_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour competitions
CREATE TRIGGER update_competitions_updated_at
BEFORE UPDATE ON public.competitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour teams
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour matches
CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour tickets
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour ticket_purchases
CREATE TRIGGER update_ticket_purchases_updated_at
BEFORE UPDATE ON public.ticket_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour personal_bets
CREATE TRIGGER update_personal_bets_updated_at
BEFORE UPDATE ON public.personal_bets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour creator_stats
CREATE TRIGGER update_creator_stats_updated_at
BEFORE UPDATE ON public.creator_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- FONCTION POUR ASSIGNER LE RÔLE USER PAR DÉFAUT
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Trigger sur auth.users pour assigner le rôle par défaut
CREATE TRIGGER on_auth_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();

-- =====================================================
-- FONCTION POUR GÉNÉRER UN CODE DE VÉRIFICATION
-- =====================================================

CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- =====================================================
-- FONCTION POUR CALCULER LA DISTRIBUTION DES GAINS
-- =====================================================

CREATE OR REPLACE FUNCTION public.calculate_gain_distribution(
  _total_gain BIGINT,
  _commission_rate DECIMAL DEFAULT 0.01
)
RETURNS TABLE (
  net_gain BIGINT,
  creator_commission BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT
    (_total_gain - FLOOR(_total_gain * _commission_rate)::BIGINT) AS net_gain,
    FLOOR(_total_gain * _commission_rate)::BIGINT AS creator_commission;
END;
$$;

-- =====================================================
-- TRIGGER POUR CRÉER LES STATS CRÉATEUR APRÈS KYC
-- =====================================================

CREATE OR REPLACE FUNCTION public.initialize_creator_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'verified' AND (OLD IS NULL OR OLD.status != 'verified') THEN
    INSERT INTO public.creator_stats (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Ajouter le rôle créateur
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'creator')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_kyc_verified
AFTER INSERT OR UPDATE ON public.creator_kyc
FOR EACH ROW
EXECUTE FUNCTION public.initialize_creator_stats();

-- =====================================================
-- TRIGGER POUR AUTO-GÉNÉRER LE CODE PHYSIQUE DU TICKET
-- =====================================================

CREATE OR REPLACE FUNCTION public.auto_generate_ticket_codes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_physical = true AND NEW.physical_code IS NULL THEN
    NEW.physical_code := 'PHY-' || public.generate_verification_code();
  END IF;
  
  IF NEW.verification_code IS NULL THEN
    NEW.verification_code := 'TKT-' || public.generate_verification_code();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_ticket_insert
BEFORE INSERT ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.auto_generate_ticket_codes();

-- =====================================================
-- DONNÉES INITIALES - PRIX DES ABONNEMENTS
-- =====================================================

INSERT INTO public.subscription_prices (tier, price, duration_days, can_print_tickets, description) VALUES
('daily', 1000, 1, false, 'Abonnement 1 jour - Publication uniquement'),
('biweekly', 3000, 14, false, 'Abonnement 2 semaines - Publication uniquement'),
('monthly', 10000, 30, true, 'Abonnement 1 mois - Publication + Impression'),
('enterprise', 50000, 365, true, 'Abonnement Entreprise 1 an - Toutes fonctionnalités');