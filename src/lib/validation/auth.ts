import { z } from 'zod';

export const signUpSchema = z
  .object({
    confirmPassword: z.string(),
    email: z
      .email('Please enter a valid email')
      .trim()
      .max(50, 'Email must not exceed 50 characters')
      .toLowerCase(),
    name: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter and one number'
      ),
    rememberMe: z.boolean(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signInSchema>;

export const signInSchema = z.object({
  email: z
    .email('Please enter a valid email')
    .trim()
    .max(50, 'Email must not exceed 50 characters')
    .toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean(),
});

export type SignInInput = z.infer<typeof signInSchema>;
