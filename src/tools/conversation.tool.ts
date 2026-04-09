import { prisma } from '../db/prisma.js'

export async function getConversationHistory(conversationId: string) {
  try {
    const latest = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, role: true, content: true, createdAt: true },
    })

    // return in chronological order for readability
    const messages = latest.reverse()

    return { conversationId, messages }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Failed to fetch conversation history: ${message}`)
  }
}

