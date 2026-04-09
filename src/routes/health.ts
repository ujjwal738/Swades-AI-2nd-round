import { Hono } from 'hono'
import { prisma } from '../db/prisma.js'

export const healthRoute = new Hono().get('/health', async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return c.json({ ok: true, db: 'up' })
  } catch (err) {
    const details = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ ok: false, db: 'down', error: 'Database unreachable', details }, 200)
  }
})

