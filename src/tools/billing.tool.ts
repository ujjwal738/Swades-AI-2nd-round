import { prisma } from '../db/prisma.js'

export async function getPaymentDetails() {
  try {
    // "mock" payment backed by real DB data: return one record deterministically
    const payment = await prisma.payment.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true, refundStatus: true, createdAt: true },
    })

    return { payment }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Failed to fetch payment details: ${message}`)
  }
}

