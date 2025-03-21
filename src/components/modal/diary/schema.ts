import { z } from 'zod';

type EditContentFormSchema = z.infer<typeof editContentFormSchema>;

const REQUIRED_ERROR_MESSAGE = 'Necessarily in need';

const editContentFormSchema = z.object({
	title: z.string({ required_error: REQUIRED_ERROR_MESSAGE }).min(2, { message: 'Write a title' }),
	content: z.string({ required_error: REQUIRED_ERROR_MESSAGE }).min(1, { message: 'Write content' }),
	feeling: z.string({ required_error: REQUIRED_ERROR_MESSAGE }).min(1, { message: 'Write one feeling' }),
	tags: z.array(z.object({ id: z.number(), tag: z.string() })),
});

export type { EditContentFormSchema };
export { editContentFormSchema };
