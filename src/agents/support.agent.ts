import { getConversationHistory } from '../tools/conversation.tool.js'

export async function supportAgent(input: { conversationId: string; message: string }) {
  const { messages } = await getConversationHistory(input.conversationId)

  const lastUserMessages = messages
    .filter((m) => m.role === 'user')
    .slice(-3)
    .map((m) => m.content)

  const context =
    lastUserMessages.length > 0 ? `Recent context: ${lastUserMessages.join(' | ')}` : 'No prior messages.'

  return `Support: I can help with general questions. You said: "${input.message}". ${context}`
}

