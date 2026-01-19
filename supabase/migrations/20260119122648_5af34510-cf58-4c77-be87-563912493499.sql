-- Corriger les fonctions sans search_path sécurisé

CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.calculate_gain_distribution(
  _total_gain BIGINT,
  _commission_rate DECIMAL DEFAULT 0.01
)
RETURNS TABLE (
  net_gain BIGINT,
  creator_commission BIGINT
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT
    (_total_gain - FLOOR(_total_gain * _commission_rate)::BIGINT) AS net_gain,
    FLOOR(_total_gain * _commission_rate)::BIGINT AS creator_commission;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_generate_ticket_codes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
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