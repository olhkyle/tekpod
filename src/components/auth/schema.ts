import { z } from 'zod';

type LoginSchema = z.infer<typeof loginSchema>;

const loginSchema = z.object({
	email: z.string({ required_error: '이메일을 입력해 주세요' }).email({ message: '이메일 형식이 올바르지 않습니다' }),
	password: z
		.string({ required_error: '비밀번호를 입력해 주세요' })
		.min(1, { message: '비밀번호를 입력해 주세요' })
		.regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{7,15}$/, {
			message: `비밀번호를 정확하게 입력해 주세요`,
		}),
});

type RegisterSchema = z.infer<typeof registerSchema>;

const registerSchema = z
	.object({
		nickname: z.string().min(2, { message: '2자리 이상의 이름을 적어주세요' }),
		email: z.string({ required_error: '이메일을 입력해 주세요' }).email({ message: '이메일 형식이 올바르지 않습니다' }),
		password: z
			.string({ required_error: '비밀번호를 입력해 주세요' })
			.min(1, { message: '비밀번호를 입력해 주세요' })
			.regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{7,15}$/, {
				message: `비밀번호를 정확하게 입력해 주세요`,
			}),
		passwordConfirm: z.string(),
	})
	.refine(data => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['passwordConfirm'],
	});

export type { LoginSchema, RegisterSchema };
export { loginSchema, registerSchema };
