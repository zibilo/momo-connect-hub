import { z } from 'zod';

// General purpose schemas that can be reused.
// Specific schemas (like phone or currency) are in their respective files.

export const IdSchema = z.string().uuid({ message: "Invalid UUID" });

export const EmailSchema = z.string().email({ message: "Invalid email address" });

export const PasswordSchema = z.string().min(8, { message: "Password must be at least 8 characters long" });
