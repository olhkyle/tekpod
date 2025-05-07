import { z } from 'zod';
import { status } from '../../../constants';

type RecordSchema = z.infer<typeof recordSchema>;

const statusSchema = z.enum(status, {
	errorMap: () => {
		return { message: 'Please select work status ' };
	},
});

const recordSchema = z.object({
	status: statusSchema,
	workplace: z
		.string({ required_error: 'Write the place where you work' })
		.min(1, { message: 'Write the place where you work at least one word' }),
	notes: z.string({ required_error: 'Write some notes' }),
});

export type { RecordSchema };
export { recordSchema };
