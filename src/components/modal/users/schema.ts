import { z } from 'zod';

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

const resetPasswordSchema = z.object({
	email: z.string().email({ message: 'Email cannot be blank' }),
});

export type { ResetPasswordSchema };
export { resetPasswordSchema };
