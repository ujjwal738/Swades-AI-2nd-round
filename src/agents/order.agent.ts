import { getOrderDetails } from '../tools/order.tool.js'

export async function orderAgent(_input: { conversationId: string; message: string }) {
  const { order } = await getOrderDetails()
  if (!order) {
    return 'Order: I could not find any orders yet.'
  }

  return `Order: status=${order.status}, trackingId=${order.trackingId}`
}

