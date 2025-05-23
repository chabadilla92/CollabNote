import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  email: z
    .string()
    .email('Please enter a valid email address.')
    .min(1, 'Email is required.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .min(1, 'Password is required.'),
});
