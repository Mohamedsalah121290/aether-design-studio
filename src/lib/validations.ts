import { z } from 'zod';

export const emailSchema = z.string().trim().email('Please enter a valid email').max(255);

export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(100);

export const checkoutSchema = z.object({
  email: emailSchema,
  password: z.string().max(100).optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
