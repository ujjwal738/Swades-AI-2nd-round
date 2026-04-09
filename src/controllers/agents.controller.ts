import { HTTPException } from 'hono/http-exception'

const agents = ['support', 'order', 'billing'] as const
type AgentType = (typeof agents)[number]

const capabilities: Record<AgentType, string[]> = {
  support: ['answer FAQs', 'help troubleshoot issues'],
  order: ['check order status', 'provide tracking guidance'],
  billing: ['explain charges', 'help with refunds'],
}

function isAgentType(type: string): type is AgentType {
  return (agents as readonly string[]).includes(type)
}

export const agentsController = {
  async listAgents(c: any) {
    return c.json({ agents })
  },

  async getCapabilities(c: any) {
    const type = c.req.param('type')
    if (!isAgentType(type)) {
      throw new HTTPException(404, { message: 'Agent type not found' })
    }

    return c.json({ type, capabilities: capabilities[type] })
  },
}

