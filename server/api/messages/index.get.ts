import { listAllMessages } from '#server/db/chat-messages'
import { toMessageDto } from '#server/utils/message-dto'

export default defineEventHandler(async () => {
  const messages = await listAllMessages()
  return messages.map(toMessageDto)
})
