import { Hono } from 'hono'

import { chatController } from '../controllers/chat.controller.js'

export const chatRoute = new Hono()
  .post('/messages', (c) => chatController.postMessage(c))
  .get('/conversations/:id', (c) => chatController.getConversation(c))
  .get('/conversations', (c) => chatController.listConversations(c))
  .delete('/conversations/:id', (c) => chatController.deleteConversation(c))

