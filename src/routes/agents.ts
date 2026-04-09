import { Hono } from 'hono'

import { agentsController } from '../controllers/agents.controller.js'

export const agentsRoute = new Hono()
  .get('/', (c) => agentsController.listAgents(c))
  .get('/:type/capabilities', (c) => agentsController.getCapabilities(c))

