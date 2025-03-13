import { z } from 'zod';

type TodoItemSchema = z.infer<typeof todoItemSchema>;

const todoItemSchema = z.object({
	content: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write Content' }),
});

export type { TodoItemSchema };
export { todoItemSchema };
