import { z } from 'zod';

type TodoItemSchema = z.infer<typeof todoItemSchema>;

const todoItemSchema = z.object({
	content: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write Content' }),
});

type QuickMemoDrawerSchema = z.infer<typeof quickMemoDrawerSchema>;

const quickMemoDrawerSchema = z.object({
	memo: z.string().min(1, { message: 'Write memo' }),
});

export type { TodoItemSchema, QuickMemoDrawerSchema };
export { todoItemSchema, quickMemoDrawerSchema };
