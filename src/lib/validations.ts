import { z } from 'zod';

export const emailSchema = z.string().trim().email('Please enter a valid email').max(255);

export const checkoutSchema = z.object({
  email: emailSchema,
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
