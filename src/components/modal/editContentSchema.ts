import { z } from 'zod';

type EditContentSchema = z.infer<typeof editContentSchema>;

const editContentSchema = z.object({
	title: z.string({ required_error: 'Necessarily in need' }).min(2, { message: 'Write a title' }),
	content: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write content' }),
	feeling: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write one feeling' }),
});

export type { EditContentSchema };
export { editContentSchema };
