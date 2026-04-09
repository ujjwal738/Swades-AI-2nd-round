import { prisma } from '../db/prisma.js'

export async function getOrderDetails() {
  try {
    // "mock" order backed by real DB data: return one record deterministically
    const order = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true, trackingId: true, createdAt: true },
    })

    return { order }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Failed to fetch order details: ${message}`)
  }
}

