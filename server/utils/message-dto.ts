import type { ChatMessageRow } from '#server/db/chat-messages'

export interface MessageDto {
  id: number
  role: ChatMessageRow['role']
  content: string
  createdAt: number
}

export function toMessageDto(message: ChatMessageRow): MessageDto {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt.getTime(),
  }
}
