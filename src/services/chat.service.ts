import { HTTPException } from 'hono/http-exception'

import { prisma } from '../db/prisma.js'
import { routerAgent } from '../agents/router.agent.js'

type CreateMessageInput = {
  conversationId: string
  content: string
}

export const chatService = {
  async createMessageAndRespond(input: CreateMessageInput) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: input.conversationId },
      select: { id: true },
    })

    if (!conversation) {
      throw new HTTPException(404, { message: 'Conversation not found' })
    }

    const userMessage = await prisma.message.create({
      data: {
        role: 'user',
        content: input.content,
        conversationId: input.conversationId,
      },
    })

    const agentText = await routerAgent({
      conversationId: input.conversationId,
      message: input.content,
    })

    const agentMessage = await prisma.message.create({
      data: {
        role: 'agent',
        content: agentText,
        conversationId: input.conversationId,
      },
    })

    return { userMessage, agentMessage, response: agentText }
  },

  async getConversation(conversationId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!conversation) {
      throw new HTTPException(404, { message: 'Conversation not found' })
    }

    return conversation
  },

  async listConversations() {
    return prisma.conversation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { messages: true } },
      },
    })
  },

  async deleteConversation(conversationId: string) {
    const existing = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true },
    })
    if (!existing) {
      throw new HTTPException(404, { message: 'Conversation not found' })
    }

    await prisma.conversation.delete({ where: { id: conversationId } })
    return { ok: true }
  },
}

