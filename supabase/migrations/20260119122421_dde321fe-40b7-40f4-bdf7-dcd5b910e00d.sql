-- =====================================================
-- FONCTIONS UTILITAIRES DE SÉCURITÉ
-- =====================================================

-- Fonction pour vérifier si un utilisateur a un rôle spécifique
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Fonction pour vérifier si un utilisateur a un abonnement actif
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.creator_subscriptions
    WHERE user_id = _user_id
      AND status = 'active'
      AND expires_at > now()
  )
$$;

-- Fonction pour vérifier si un utilisateur peut imprimer des tickets
CREATE OR REPLACE FUNCTION public.can_print_tickets(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.creator_subscriptions cs
    JOIN public.subscription_prices sp ON cs.tier = sp.tier
    WHERE cs.user_id = _user_id
      AND cs.status = 'active'
      AND cs.expires_at > now()
      AND sp.can_print_tickets = true
  )
$$;

-- Fonction pour vérifier le KYC vérifié
CREATE OR REPLACE FUNCTION public.has_verified_kyc(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.creator_kyc
    WHERE user_id = _user_id
      AND status = 'verified'
  )
$$;

-- =====================================================
-- POLITIQUES RLS - USER_ROLES
-- =====================================================

-- Les utilisateurs peuvent voir leurs propres rôles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Seuls les admins peuvent gérer les rôles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.is_admin(auth.uid()));

-- =====================================================
-- POLITIQUES RLS - CREATOR_KYC
-- =====================================================

-- Les utilisateurs peuvent voir leur propre KYC
CREATE POLICY "Users can view own kyc"
ON public.creator_kyc FOR SELECT
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent soumettre leur KYC
CREATE POLICY "Users can insert own kyc"
ON public.creator_kyc FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leur KYC en attente
CREATE POLICY "Users can update pending kyc"
ON public.creator_kyc FOR UPDATE
USING (auth.uid() = user_id AND status IN ('pending', 'rejected'));

-- Les admins peuvent tout gérer
CREATE POLICY "Admins can manage all kyc"
ON public.creator_kyc FOR ALL
USING (public.is_admin(auth.uid()));

-- =====================================================
-- POLITIQUES RLS - SUBSCRIPTION_PRICES
-- =====================================================

-- Tout le monde peut voir les prix actifs
CREATE POLICY "Anyone can view active prices"
ON public.subscription_prices FOR SELECT
USING (is_active = true);

-- Les admins peuvent tout gérer
CREATE POLICY "Admins can manage prices"
ON public.subscription_prices FOR ALL
USING (public.is_admin(auth.uid()));

-- =====================================================
-- POLITIQUES RLS - CREATOR_SUBSCRIPTIONS
-- =====================================================

-- Les utilisateurs peuvent voir leurs abonnements
CREATE POLICY "Users can view own subscriptions"
ON public.creator_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs abonnements
CREATE POLICY "Users can create subscriptions"
ON public.creator_subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can manage subscriptions"
ON public.creator_subscriptions FOR ALL
USING (public.is_admin(auth.uid()));

-- =====================================================
-- POLITIQUES RLS - COMPETITIONS, TEAMS, MATCHES (publiques en lecture)
-- =====================================================

-- Compétitions - lecture publique
CREATE POLICY "Anyone can view competitions"
ON public.competitions FOR SELECT
USING (true);

CREATE POLICY "Admins can manage competitions"
ON public.competitions FOR ALL
USING (public.is_admin(auth.uid()));

-- Équipes - lecture publique
CREATE POLICY "Anyone can view teams"
ON public.teams FOR SELECT
USING (true);

CREATE POLICY "Admins can manage teams"
ON public.teams FOR ALL
USING (public.is_admin(auth.uid()));

-- Matchs - lecture publique
CREATE POLICY "Anyone can view matches"
ON public.matches FOR SELECT
USING (true);

CREATE POLICY "Admins can manage matches"
ON public.matches FOR ALL
USING (public.is_admin(auth.uid()));

-- =====================================================
-- POLITIQUES RLS - TICKETS
-- =====================================================

-- Tout le monde peut voir les tickets actifs publiés
CREATE POLICY "Anyone can view active tickets"
ON public.tickets FOR SELECT
USING (status = 'active' AND published_at IS NOT NULL);

-- Les créateurs peuvent voir tous leurs tickets
CREATE POLICY "Creators can view own tickets"
ON public.tickets FOR SELECT
USING (auth.uid() = creator_id);

-- Les créateurs avec abonnement actif peuvent créer des tickets
CREATE POLICY "Creators can create tickets"
ON public.tickets FOR INSERT
WITH CHECK (
  auth.uid() = creator_id 
  AND public.has_active_subscription(auth.uid())
  AND public.has_verified_kyc(auth.uid())
);

-- Les créateurs peuvent modifier leurs tickets en attente
CREATE POLICY "Creators can update pending tickets"
ON public.tickets FOR UPDATE
USING (auth.uid() = creator_id AND status = 'pending');

-- Les admins peuvent tout gérer
CREATE POLICY "Admins can manage all tickets"
ON public.tickets FOR ALL
USING (public.is_admin(auth.uid()));

-- =====================================================
-- POLITIQUES RLS - TICKET_SELECTIONS
-- =====================================================

-- Lecture publique pour les tickets actifs
CREATE POLICY "Anyone can view selections of active tickets"
ON public.ticket_selections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tickets t
    WHERE t.id = ticket_id
    AND (t.status = 'active' OR t.creator_id = auth.uid())
  )
);

-- Les créateurs peuvent créer des sélections
CREATE POLICY "Creators can insert selections"
ON public.ticket_selections FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tickets t
    WHERE t.id = ticket_id
    AND t.creator_id = auth.uid()
    AND t.status = 'pending'
  )
);

-- =====================================================
-- POLITIQUES RLS - TICKET_PURCHASES
-- =====================================================

-- Les acheteurs peuvent voir leurs achats
CREATE POLICY "Buyers can view own purchases"
ON public.ticket_purchases FOR SELECT
USING (auth.uid() = buyer_id);

-- Les créateurs peuvent voir les achats de leurs tickets
CREATE POLICY "Creators can view purchases of their tickets"
ON public.ticket_purchases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tickets t
    WHERE t.id = ticket_id
    AND t.creator_id = auth.uid()
  )
);

-- Les utilisateurs peuvent acheter (pas leurs propres tickets)
CREATE POLICY "Users can purchase tickets"
ON public.ticket_purchases FOR INSERT
WITH CHECK (
  auth.uid() = buyer_id
  AND NOT EXISTS (
    SELECT 1 FROM public.tickets t
    WHERE t.id = ticket_id
    AND t.creator_id = auth.uid()
  )
);

-- =====================================================
-- POLITIQUES RLS - PERSONAL_BETS
-- =====================================================

CREATE POLICY "Users can view own personal bets"
ON public.personal_bets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create personal bets"
ON public.personal_bets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update pending personal bets"
ON public.personal_bets FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- =====================================================
-- POLITIQUES RLS - PERSONAL_BET_SELECTIONS
-- =====================================================

CREATE POLICY "Users can view own bet selections"
ON public.personal_bet_selections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.personal_bets pb
    WHERE pb.id = personal_bet_id
    AND pb.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert bet selections"
ON public.personal_bet_selections FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.personal_bets pb
    WHERE pb.id = personal_bet_id
    AND pb.user_id = auth.uid()
    AND pb.status = 'pending'
  )
);

-- =====================================================
-- POLITIQUES RLS - CREATOR_COMMISSIONS
-- =====================================================

CREATE POLICY "Creators can view own commissions"
ON public.creator_commissions FOR SELECT
USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage commissions"
ON public.creator_commissions FOR ALL
USING (public.is_admin(auth.uid()));

-- =====================================================
-- POLITIQUES RLS - PHYSICAL_TICKET_VERIFICATIONS
-- =====================================================

CREATE POLICY "Users can view own verifications"
ON public.physical_ticket_verifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create verifications"
ON public.physical_ticket_verifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLITIQUES RLS - CREATOR_STATS
-- =====================================================

-- Lecture publique des stats
CREATE POLICY "Anyone can view creator stats"
ON public.creator_stats FOR SELECT
USING (true);

-- Seuls les admins peuvent modifier
CREATE POLICY "Admins can manage stats"
ON public.creator_stats FOR ALL
USING (public.is_admin(auth.uid()));