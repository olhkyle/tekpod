import { z } from 'zod';

type QuickMemoDrawerSchema = z.infer<typeof quickMemoDrawerSchema>;

const quickMemoDrawerSchema = z.object({
	memo: z.string({ required_error: 'Necessarily in need' }).min(1, { message: 'Write memo' }),
});

export type { QuickMemoDrawerSchema };
export { quickMemoDrawerSchema };
