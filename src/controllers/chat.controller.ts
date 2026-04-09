import { HTTPException } from 'hono/http-exception'

import { chatService } from '../services/chat.service.js'

export const chatController = {
  async postMessage(c: any) {
    const body = await c.req.json().catch(() => null)
    const conversationId = body?.conversationId
    const content = body?.message

    if (typeof conversationId !== 'string' || conversationId.length === 0) {
      throw new HTTPException(400, { message: 'conversationId is required' })
    }
    if (typeof content !== 'string' || content.trim().length === 0) {
      throw new HTTPException(400, { message: 'message is required' })
    }

    const result = await chatService.createMessageAndRespond({
      conversationId,
      content: content.trim(),
    })

    return c.json({
      response: result.response,
      userMessage: result.userMessage,
      agentMessage: result.agentMessage,
    })
  },

  async getConversation(c: any) {
    const id = c.req.param('id')
    const conversation = await chatService.getConversation(id)
    return c.json(conversation)
  },

  async listConversations(c: any) {
    const conversations = await chatService.listConversations()
    return c.json(conversations)
  },

  async deleteConversation(c: any) {
    const id = c.req.param('id')
    const result = await chatService.deleteConversation(id)
    return c.json(result)
  },
}

