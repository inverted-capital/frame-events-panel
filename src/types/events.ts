import { z } from 'zod'

export const eventTypeSchema = z.enum([
  'message_received',
  'thread_started', 
  'file_altered',
  'file_deleted',
  'app_installed'
])

export const eventSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  timestamp: z.string(),
  metadata: z.object({
    contact: z.string().optional(),
    threadId: z.string().optional(),
    fileName: z.string().optional(),
    filePath: z.string().optional(),
    appName: z.string().optional(),
    appVersion: z.string().optional()
  }).optional()
})

export const eventsDataSchema = z.object({
  events: z.array(eventSchema)
})

export type EventType = z.infer<typeof eventTypeSchema>
export type Event = z.infer<typeof eventSchema>
export type EventsData = z.infer<typeof eventsDataSchema>