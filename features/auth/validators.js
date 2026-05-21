import { z } from 'zod'
import { normalizeEmail, sanitizeString } from '@/core/utils/security.server'

const emailSchema = z.string().trim().email({ message: 'Email non valida.' }).transform(normalizeEmail)
const passwordSchema = z
  .string()
  .min(10, { message: 'La password deve contenere almeno 10 caratteri.' })
  .regex(/[A-Z]/, { message: 'La password deve contenere almeno una lettera maiuscola.' })
  .regex(/[a-z]/, { message: 'La password deve contenere almeno una lettera minuscola.' })
  .regex(/[0-9]/, { message: 'La password deve contenere almeno una cifra.' })
  .regex(/[^A-Za-z0-9]/, { message: 'La password deve contenere almeno un carattere speciale.' })

export const registerSchema = z
  .object({
    fullName: z.string().min(2, { message: 'Inserisci un nome valido.' }).max(100).transform(sanitizeString),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Le password devono coincidere.',
  })

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'La password è obbligatoria.' }),
})

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional().transform((value) => (value ? sanitizeString(value) : value)),
  password: passwordSchema.optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password || data.confirmPassword) {
    return data.password && data.password === data.confirmPassword
  }
  return true
}, {
  message: 'Le password devono coincidere.',
  path: ['confirmPassword'],
})
