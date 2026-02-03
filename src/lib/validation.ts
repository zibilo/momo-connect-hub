import { z } from 'zod';
import { MIN_DEPOSIT, MAX_DEPOSIT, MIN_WITHDRAWAL, MAX_WITHDRAWAL, MIN_TICKET_PRICE, MAX_TICKET_PRICE } from './constants';
import { isValidMoMoPhone } from './phone';

export const phoneSchema = z.string()
  .min(9, 'Numéro de téléphone invalide')
  .refine(isValidMoMoPhone, 'Numéro MTN MoMo invalide');

export const depositSchema = z.object({
  amount: z.number()
    .min(MIN_DEPOSIT, `Montant minimum: ${MIN_DEPOSIT} FCFA`)
    .max(MAX_DEPOSIT, `Montant maximum: ${MAX_DEPOSIT} FCFA`),
  phone_number: phoneSchema,
});

export const withdrawalSchema = z.object({
  amount: z.number()
    .min(MIN_WITHDRAWAL, `Montant minimum: ${MIN_WITHDRAWAL} FCFA`)
    .max(MAX_WITHDRAWAL, `Montant maximum: ${MAX_WITHDRAWAL} FCFA`),
  phone_number: phoneSchema,
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court (6 caractères min)'),
});

export const signupSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court (6 caractères min)'),
  full_name: z.string().min(2, 'Nom trop court'),
  phone_number: phoneSchema.optional(),
});

export const ticketSchema = z.object({
  title: z.string().min(3, 'Titre trop court').max(100, 'Titre trop long'),
  description: z.string().max(500, 'Description trop longue').optional(),
  price: z.number()
    .min(MIN_TICKET_PRICE, `Prix minimum: ${MIN_TICKET_PRICE} FCFA`)
    .max(MAX_TICKET_PRICE, `Prix maximum: ${MAX_TICKET_PRICE} FCFA`),
  visibility: z.enum(['public', 'subscribers', 'private']),
  selections: z.array(z.object({
    match_id: z.string(),
    market: z.string(),
    selection: z.string(),
    odds: z.number().min(1.01),
  })).min(1, 'Au moins une sélection requise'),
});

export const kycSchema = z.object({
  document_type: z.enum(['passport', 'national_id', 'driver_license']),
  document_url: z.string().url('URL du document invalide'),
  selfie_url: z.string().url('URL du selfie invalide').optional(),
});

export const personalBetSchema = z.object({
  stake: z.number().min(100, 'Mise minimum: 100 FCFA'),
  selections: z.array(z.object({
    match_id: z.string(),
    market: z.string(),
    selection: z.string(),
    odds: z.number().min(1.01),
  })).min(1, 'Au moins une sélection requise'),
});

export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type KYCInput = z.infer<typeof kycSchema>;
export type PersonalBetInput = z.infer<typeof personalBetSchema>;
