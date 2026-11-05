import { asc, gte } from 'drizzle-orm'

export type ChatRole = (typeof schema.chatMessages.$inferSelect)['role']

export interface ChatMessageRow {
  id: number
  role: ChatRole
  content: string
  createdAt: Date
}

const HISTORY_DAYS = 7

export async function addUserMessage(content: string): Promise<ChatMessageRow> {
  const [inserted] = await db
    .insert(schema.chatMessages)
    .values({ role: 'user', content })
    .returning({
      id: schema.chatMessages.id,
      role: schema.chatMessages.role,
      content: schema.chatMessages.content,
      createdAt: schema.chatMessages.createdAt,
    })

  if (!inserted) {
    throw new Error('insert chat_messages returned no row')
  }

  return inserted
}

export async function addAssistantMessage(content: string): Promise<void> {
  await db.insert(schema.chatMessages).values({ role: 'assistant', content })
}

export async function listAllMessages(): Promise<ChatMessageRow[]> {
  return db
    .select({
      id: schema.chatMessages.id,
      role: schema.chatMessages.role,
      content: schema.chatMessages.content,
      createdAt: schema.chatMessages.createdAt,
    })
    .from(schema.chatMessages)
    .orderBy(asc(schema.chatMessages.id))
}

export function listContextMessages() {
  return db
    .select({
      role: schema.chatMessages.role,
      content: schema.chatMessages.content,
    })
    .from(schema.chatMessages)
    .where(gte(schema.chatMessages.createdAt, sevenDaysAgo()))
    .orderBy(asc(schema.chatMessages.id))
}

function sevenDaysAgo(): Date {
  const nowSeconds = Math.floor(Date.now() / 1000)
  return new Date((nowSeconds - HISTORY_DAYS * 24 * 60 * 60) * 1000)
}
