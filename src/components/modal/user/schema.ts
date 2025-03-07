import { z } from 'zod';

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

const resetPasswordSchema = z.object({
	email: z.string().email({ message: 'Email cannot be blank' }),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

const updateProfileSchema = z.object({
	nickname: z.string({ required_error: 'Nickname cannot be blank' }).min(2, { message: 'Over 2 length of name' }),
});

export type { ResetPasswordSchema, UpdateProfileSchema };
export { resetPasswordSchema, updateProfileSchema };
