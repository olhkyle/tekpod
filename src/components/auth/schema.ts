import { z } from 'zod';

type LoginSchema = z.infer<typeof loginSchema>;

const loginSchema = z.object({
	email: z.string({ required_error: 'Please, Write an email' }).email({ message: 'Incorrect email format' }),
	password: z
		.string({ required_error: 'Please, Write a password' })
		.min(1, { message: 'Write a password' })
		.regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{7,15}$/, {
			message: `Write correct password format`,
		}),
});

type RegisterSchema = z.infer<typeof registerSchema>;

const registerSchema = z
	.object({
		email: z.string({ required_error: 'Please, Write an email' }).email({ message: 'Incorrect email format' }),

		password: z
			.string({ required_error: 'Please, Write a password' })
			.min(1, { message: 'Please, Write a password' })
			.regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{7,15}$/, {
				message: `Write correct password format`,
			}),
		nickname: z.string().min(2, { message: 'Over 2 length of name' }),
		// passwordConfirm: z.string(),
	})
	.partial();
// .refine(data => data.password === data.passwordConfirm, {
// 	message: "Passwords don't match",
// 	path: ['passwordConfirm'],
// });

export type { LoginSchema, RegisterSchema };
export { loginSchema, registerSchema };
