import { z } from 'zod';

type EditTodoItemFormSchema = z.infer<typeof editTodoItemFormSchema>;

const editTodoItemFormSchema = z.object({
	content: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write Content' }),
	tags: z.array(z.object({ id: z.number(), tag: z.string() })),
	reminder_time: z.date({ required_error: 'Select Date in essential', invalid_type_error: 'Select the correct Data' }),
});

export type { EditTodoItemFormSchema };
export { editTodoItemFormSchema };
