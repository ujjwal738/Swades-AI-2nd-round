import { billingAgent } from './billing.agent.js'
import { orderAgent } from './order.agent.js'
import { supportAgent } from './support.agent.js'
import { maybeGenerateText } from './llm.js'
import { getConversationHistory } from '../tools/conversation.tool.js'

export async function routerAgent(input: { conversationId: string; message: string }) {
  const text = input.message.toLowerCase()

  let agentName: 'order' | 'billing' | 'support' = 'support'
  let fallback: string

  if (text.includes('order') || text.includes('track')) {
    agentName = 'order'
    fallback = await orderAgent(input)
  } else if (text.includes('payment') || text.includes('refund') || text.includes('invoice')) {
    agentName = 'billing'
    fallback = await billingAgent(input)
  } else {
    agentName = 'support'
    fallback = await supportAgent(input)
  }

  const { messages } = await getConversationHistory(input.conversationId)
  const context = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n')

  return maybeGenerateText({
    system:
      'You are a helpful support assistant. Respond in plain text, concise and friendly. Do not mention internal tools.',
    prompt:
      `Agent type: ${agentName}\n` +
      `Conversation (last 5 messages):\n${context || '(empty)'}\n\n` +
      `User just said: ${input.message}\n\n` +
      `Deterministic agent draft response:\n${fallback}\n\n` +
      `Rewrite the draft to be slightly more natural while keeping the same facts.`,
    fallback,
  })
}

