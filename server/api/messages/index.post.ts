import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { generateText } from 'ai'
import { SYSTEM_PROMPT } from '#server/ai/system-prompt'
import { tools } from '#server/ai/tools'
import { addAssistantMessage, addUserMessage, listContextMessages } from '#server/db/chat-messages'
import { toMessageDto } from '#server/utils/message-dto'

export default defineEventHandler(async (event) => {
  const { content } = await readBody<{ content: string }>(event)
  const message = await addUserMessage(content)
  const { ai } = useRuntimeConfig(event)

  event.waitUntil((async () => {
    const provider = createOpenAICompatible({
      name: 'custom',
      baseURL: ai.baseURL,
      apiKey: ai.apiKey,
    })

    const result = await generateText({
      model: provider(ai.model),
      instructions: SYSTEM_PROMPT,
      messages: await listContextMessages(),
      tools,
      stopWhen: () => false,
    })

    const text = result.text.trim()
    if (!text)
      return

    await addAssistantMessage(text)
  })())

  return toMessageDto(message)
})
