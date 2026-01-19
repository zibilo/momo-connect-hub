export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      competitions: {
        Row: {
          country: string | null
          created_at: string
          external_id: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          season: string | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          season?: string | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          season?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      creator_commissions: {
        Row: {
          amount: number
          commission_rate: number
          created_at: string
          creator_id: string
          id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["commission_status"]
          ticket_purchase_id: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          commission_rate?: number
          created_at?: string
          creator_id: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          ticket_purchase_id: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          commission_rate?: number
          created_at?: string
          creator_id?: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          ticket_purchase_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_commissions_ticket_purchase_id_fkey"
            columns: ["ticket_purchase_id"]
            isOneToOne: false
            referencedRelation: "ticket_purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_commissions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_kyc: {
        Row: {
          address: string | null
          created_at: string
          full_name: string
          id: string
          id_back_url: string | null
          id_front_url: string | null
          id_number: string
          phone_number: string
          rejection_reason: string | null
          selfie_url: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name: string
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          id_number: string
          phone_number: string
          rejection_reason?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          id_number?: string
          phone_number?: string
          rejection_reason?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      creator_stats: {
        Row: {
          created_at: string
          id: string
          rating: number
          total_commissions_earned: number
          total_losses: number
          total_ratings: number
          total_revenue: number
          total_tickets_created: number
          total_tickets_sold: number
          total_wins: number
          updated_at: string
          user_id: string
          win_rate: number
        }
        Insert: {
          created_at?: string
          id?: string
          rating?: number
          total_commissions_earned?: number
          total_losses?: number
          total_ratings?: number
          total_revenue?: number
          total_tickets_created?: number
          total_tickets_sold?: number
          total_wins?: number
          updated_at?: string
          user_id: string
          win_rate?: number
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          total_commissions_earned?: number
          total_losses?: number
          total_ratings?: number
          total_revenue?: number
          total_tickets_created?: number
          total_tickets_sold?: number
          total_wins?: number
          updated_at?: string
          user_id?: string
          win_rate?: number
        }
        Relationships: []
      }
      creator_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          price_paid: number
          starts_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          tier: Database["public"]["Enums"]["subscription_tier"]
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          price_paid: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier: Database["public"]["Enums"]["subscription_tier"]
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          price_paid?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: Database["public"]["Enums"]["subscription_tier"]
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_subscriptions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team_id: string | null
          competition_id: string | null
          created_at: string
          external_id: string | null
          finished_at: string | null
          home_score: number | null
          home_team_id: string | null
          id: string
          odds_away: number | null
          odds_draw: number | null
          odds_home: number | null
          result: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["match_status"]
          updated_at: string
        }
        Insert: {
          away_score?: number | null
          away_team_id?: string | null
          competition_id?: string | null
          created_at?: string
          external_id?: string | null
          finished_at?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          odds_away?: number | null
          odds_draw?: number | null
          odds_home?: number | null
          result?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Update: {
          away_score?: number | null
          away_team_id?: string | null
          competition_id?: string | null
          created_at?: string
          external_id?: string | null
          finished_at?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          odds_away?: number | null
          odds_draw?: number | null
          odds_home?: number | null
          result?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_bet_selections: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean | null
          match_id: string
          odds: number
          personal_bet_id: string
          prediction: string
          result_checked_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          match_id: string
          odds: number
          personal_bet_id: string
          prediction: string
          result_checked_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          match_id?: string
          odds?: number
          personal_bet_id?: string
          prediction?: string
          result_checked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_bet_selections_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_bet_selections_personal_bet_id_fkey"
            columns: ["personal_bet_id"]
            isOneToOne: false
            referencedRelation: "personal_bets"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_bets: {
        Row: {
          actual_gain: number | null
          created_at: string
          id: string
          potential_gain: number
          result_checked_at: string | null
          stake_amount: number
          status: Database["public"]["Enums"]["personal_bet_status"]
          title: string | null
          total_odds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_gain?: number | null
          created_at?: string
          id?: string
          potential_gain: number
          result_checked_at?: string | null
          stake_amount: number
          status?: Database["public"]["Enums"]["personal_bet_status"]
          title?: string | null
          total_odds?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_gain?: number | null
          created_at?: string
          id?: string
          potential_gain?: number
          result_checked_at?: string | null
          stake_amount?: number
          status?: Database["public"]["Enums"]["personal_bet_status"]
          title?: string | null
          total_odds?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      physical_ticket_verifications: {
        Row: {
          id: string
          is_valid: boolean
          ticket_id: string
          user_id: string
          verification_code: string
          verification_message: string | null
          verified_at: string
        }
        Insert: {
          id?: string
          is_valid?: boolean
          ticket_id: string
          user_id: string
          verification_code: string
          verification_message?: string | null
          verified_at?: string
        }
        Update: {
          id?: string
          is_valid?: boolean
          ticket_id?: string
          user_id?: string
          verification_code?: string
          verification_message?: string | null
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "physical_ticket_verifications_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_prices: {
        Row: {
          can_print_tickets: boolean
          created_at: string
          description: string | null
          duration_days: number
          id: string
          is_active: boolean
          price: number
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          can_print_tickets?: boolean
          created_at?: string
          description?: string | null
          duration_days: number
          id?: string
          is_active?: boolean
          price: number
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          can_print_tickets?: boolean
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean
          price?: number
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          country: string | null
          created_at: string
          external_id: string | null
          id: string
          logo_url: string | null
          name: string
          short_name: string | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          logo_url?: string | null
          name: string
          short_name?: string | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          short_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ticket_purchases: {
        Row: {
          actual_gain: number | null
          buyer_id: string
          created_at: string
          creator_commission: number | null
          creator_commission_paid: boolean
          gain_paid: boolean
          gain_paid_at: string | null
          id: string
          is_physical_purchase: boolean
          physical_code_used: string | null
          potential_gain: number
          price_paid: number
          stake_amount: number
          status: Database["public"]["Enums"]["ticket_status"]
          ticket_id: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          actual_gain?: number | null
          buyer_id: string
          created_at?: string
          creator_commission?: number | null
          creator_commission_paid?: boolean
          gain_paid?: boolean
          gain_paid_at?: string | null
          id?: string
          is_physical_purchase?: boolean
          physical_code_used?: string | null
          potential_gain: number
          price_paid: number
          stake_amount: number
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_id: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          actual_gain?: number | null
          buyer_id?: string
          created_at?: string
          creator_commission?: number | null
          creator_commission_paid?: boolean
          gain_paid?: boolean
          gain_paid_at?: string | null
          id?: string
          is_physical_purchase?: boolean
          physical_code_used?: string | null
          potential_gain?: number
          price_paid?: number
          stake_amount?: number
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_id?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_purchases_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_purchases_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_selections: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean | null
          match_id: string
          odds: number
          prediction: string
          result_checked_at: string | null
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          match_id: string
          odds: number
          prediction: string
          result_checked_at?: string | null
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          match_id?: string
          odds?: number
          prediction?: string
          result_checked_at?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_selections_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_selections_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          creator_id: string
          current_purchases: number
          description: string | null
          expires_at: string | null
          id: string
          is_physical: boolean
          max_purchases: number | null
          physical_code: string | null
          potential_gain: number
          price: number
          price_tier: Database["public"]["Enums"]["ticket_price_tier"]
          published_at: string | null
          result_checked_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
          total_odds: number
          updated_at: string
          verification_code: string | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          current_purchases?: number
          description?: string | null
          expires_at?: string | null
          id?: string
          is_physical?: boolean
          max_purchases?: number | null
          physical_code?: string | null
          potential_gain: number
          price: number
          price_tier: Database["public"]["Enums"]["ticket_price_tier"]
          published_at?: string | null
          result_checked_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          title: string
          total_odds?: number
          updated_at?: string
          verification_code?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          current_purchases?: number
          description?: string | null
          expires_at?: string | null
          id?: string
          is_physical?: boolean
          max_purchases?: number | null
          physical_code?: string | null
          potential_gain?: number
          price?: number
          price_tier?: Database["public"]["Enums"]["ticket_price_tier"]
          published_at?: string | null
          result_checked_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          title?: string
          total_odds?: number
          updated_at?: string
          verification_code?: string | null
        }
        Relationships: []
      }
      transaction_audit_logs: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          new_status: Database["public"]["Enums"]["transaction_status"]
          previous_status:
            | Database["public"]["Enums"]["transaction_status"]
            | null
          transaction_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          new_status: Database["public"]["Enums"]["transaction_status"]
          previous_status?:
            | Database["public"]["Enums"]["transaction_status"]
            | null
          transaction_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          new_status?: Database["public"]["Enums"]["transaction_status"]
          previous_status?:
            | Database["public"]["Enums"]["transaction_status"]
            | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_audit_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          error_message: string | null
          external_reference: string | null
          id: string
          mtn_reference: string | null
          phone_number: string
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          error_message?: string | null
          external_reference?: string | null
          id?: string
          mtn_reference?: string | null
          phone_number: string
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          error_message?: string | null
          external_reference?: string | null
          id?: string
          mtn_reference?: string | null
          phone_number?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          locked_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          locked_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          locked_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "creator"
      commission_status: "pending" | "paid" | "cancelled"
      kyc_status: "pending" | "submitted" | "verified" | "rejected"
      match_status:
        | "scheduled"
        | "live"
        | "finished"
        | "postponed"
        | "cancelled"
      personal_bet_status: "pending" | "active" | "won" | "lost" | "cancelled"
      subscription_status: "pending" | "active" | "expired" | "cancelled"
      subscription_tier: "daily" | "biweekly" | "monthly" | "enterprise"
      ticket_price_tier: "basic" | "standard" | "premium"
      ticket_status:
        | "pending"
        | "active"
        | "match_finished"
        | "won"
        | "lost"
        | "paid_out"
        | "cancelled"
        | "expired"
      transaction_status:
        | "pending"
        | "processing"
        | "successful"
        | "failed"
        | "cancelled"
      transaction_type: "deposit" | "withdrawal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "creator"],
      commission_status: ["pending", "paid", "cancelled"],
      kyc_status: ["pending", "submitted", "verified", "rejected"],
      match_status: ["scheduled", "live", "finished", "postponed", "cancelled"],
      personal_bet_status: ["pending", "active", "won", "lost", "cancelled"],
      subscription_status: ["pending", "active", "expired", "cancelled"],
      subscription_tier: ["daily", "biweekly", "monthly", "enterprise"],
      ticket_price_tier: ["basic", "standard", "premium"],
      ticket_status: [
        "pending",
        "active",
        "match_finished",
        "won",
        "lost",
        "paid_out",
        "cancelled",
        "expired",
      ],
      transaction_status: [
        "pending",
        "processing",
        "successful",
        "failed",
        "cancelled",
      ],
      transaction_type: ["deposit", "withdrawal"],
    },
  },
} as const
