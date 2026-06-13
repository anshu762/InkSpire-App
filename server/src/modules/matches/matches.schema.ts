import { z } from 'zod';

export const SendMatchRequestSchema = z.object({
  receiveeId: z.string().uuid(),
});

export type SendMatchRequestInput = z.infer<typeof SendMatchRequestSchema>;
