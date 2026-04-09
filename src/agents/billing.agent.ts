import { getPaymentDetails } from '../tools/billing.tool.js'

export async function billingAgent(_input: { conversationId: string; message: string }) {
  const { payment } = await getPaymentDetails()
  if (!payment) {
    return 'Billing: I could not find any payments yet.'
  }

  return `Billing: paymentStatus=${payment.status}, refundStatus=${payment.refundStatus}`
}

