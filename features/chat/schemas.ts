import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  image: z.string().optional(),
  imageType: z.string().optional(),
});

export const LocationSchema = z.object({
  country: z.string(),
  state: z.string().optional(),
  county: z.string().optional(),
});

export const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema),
  location: LocationSchema.nullable(),
  language: z.string().default('English'),
});

export type Message = z.infer<typeof MessageSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
