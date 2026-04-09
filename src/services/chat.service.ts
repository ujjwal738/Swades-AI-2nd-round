import { HTTPException } from 'hono/http-exception'

import { prisma } from '../db/prisma.js'
import { routerAgent } from '../agents/router.agent.js'

type CreateMessageInput = {
  conversationId?: string
  content: string
}

export const chatService = {
  async createMessageAndRespond(input: CreateMessageInput) {
    let conversationId = input.conversationId?.trim()
    if (!conversationId) {
      const user = await prisma.user.create({ data: {} })
      const conversation = await prisma.conversation.create({
        data: { userId: user.id },
        select: { id: true },
      })
      conversationId = conversation.id

      await prisma.order.createMany({
        data: [
          { status: 'pending', trackingId: `TRACK-${conversationId.slice(-4)}-001` },
          { status: 'shipped', trackingId: `TRACK-${conversationId.slice(-4)}-002` },
        ],
        skipDuplicates: true,
      })

      await prisma.payment.createMany({
        data: [
          { status: 'paid', refundStatus: 'none' },
          { status: 'failed', refundStatus: 'none' },
        ],
      })
    } else {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { id: true },
      })

      if (!conversation) {
        throw new HTTPException(404, { message: 'Conversation not found' })
      }
    }

    const userMessage = await prisma.message.create({
      data: {
        role: 'user',
        content: input.content,
        conversationId,
      },
    })

    const agentText = await routerAgent({
      conversationId,
      message: input.content,
    })

    const agentMessage = await prisma.message.create({
      data: {
        role: 'agent',
        content: agentText,
        conversationId,
      },
    })

    return { conversationId, userMessage, agentMessage, response: agentText }
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

