import { z } from 'zod';

type LoginSchema = z.infer<typeof loginSchema>;

const loginSchema = z.object({
	email: z.string({ required_error: 'Email cannot be blank' }).email({ message: 'Email is invalid' }),
	password: z
		.string({ required_error: 'Password cannot be blank' })
		.min(1, { message: 'Password cannot be blank' })
		.regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{7,15}$/, {
			message: `Write correct password format`,
		}),
});

type RegisterSchema = z.infer<typeof registerSchema>;

const registerSchema = z.object({
	email: z.string({ required_error: 'Email cannot be blank' }).email({ message: 'Email is invalid' }),
	password: z
		.string({ required_error: 'Password cannot be blank' })
		.min(1, { message: 'Password cannot be blank' })
		.regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{7,15}$/, {
			message: `Write correct password format`,
		}),
	nickname: z.string().min(2, { message: 'Over 2 length of name' }),
});

export type { LoginSchema, RegisterSchema };
export { loginSchema, registerSchema };
