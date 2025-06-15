import { z } from 'zod'
import { eventTypeSchema } from './events'

export const actionTypeSchema = z.enum([
  'notification',
  'webhook', 
  'email',
  'log',
  'custom'
])

export const actionSchema = z.object({
  id: z.string(),
  type: actionTypeSchema,
  name: z.string(),
  description: z.string(),
  config: z.record(z.any()).optional()
})

export const eventTriggerSchema = z.object({
  type: z.literal('event'),
  eventType: eventTypeSchema.optional(),
  titleContains: z.string().optional(),
  descriptionContains: z.string().optional(),
  contactEquals: z.string().optional()
})

export const timerTriggerSchema = z.object({
  type: z.literal('timer'),
  cronExpression: z.string(),
  description: z.string()
})

export const triggerConditionSchema = z.union([
  eventTriggerSchema,
  timerTriggerSchema
])

export const triggerSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  condition: triggerConditionSchema,
  actions: z.array(actionSchema),
  createdAt: z.string(),
  lastTriggered: z.string().optional(),
  triggerCount: z.number().default(0)
})

export const triggersDataSchema = z.object({
  triggers: z.array(triggerSchema)
})

export type ActionType = z.infer<typeof actionTypeSchema>
export type Action = z.infer<typeof actionSchema>
export type EventTrigger = z.infer<typeof eventTriggerSchema>
export type TimerTrigger = z.infer<typeof timerTriggerSchema>
export type TriggerCondition = z.infer<typeof triggerConditionSchema>
export type Trigger = z.infer<typeof triggerSchema>
export type TriggersData = z.infer<typeof triggersDataSchema>