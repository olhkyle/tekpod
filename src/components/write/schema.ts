import { z } from 'zod';

type WriteSchema = z.infer<typeof writeSchema>;

const writeSchema = z.object({
	title: z.string({ required_error: 'Necessarily in need' }).min(2, { message: 'Write a title' }),
	content: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write content' }),
	feeling: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write one feeling' }),
});

export type { WriteSchema };
export { writeSchema };
