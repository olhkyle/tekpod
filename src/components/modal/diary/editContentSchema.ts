import { z } from 'zod';

type EditContentFormSchema = z.infer<typeof editContentFormSchema>;

const editContentFormSchema = z.object({
	title: z.string({ required_error: 'Necessarily in need' }).min(2, { message: 'Write a title' }),
	content: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write content' }),
	feeling: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write one feeling' }),
});

export type { EditContentFormSchema };
export { editContentFormSchema };
