import { prisma } from '../src/db/prisma.js'

async function main() {
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.user.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()

  await prisma.order.createMany({
    data: [
      { status: 'pending', trackingId: 'TRACK-001' },
      { status: 'shipped', trackingId: 'TRACK-002' },
    ],
  })

  await prisma.payment.createMany({
    data: [
      { status: 'paid', refundStatus: 'none' },
      { status: 'failed', refundStatus: 'none' },
    ],
  })

  const user = await prisma.user.create({ data: {} })

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      messages: {
        create: [
          { role: 'user', content: 'Hello!' },
          { role: 'agent', content: 'Hi — how can I help?' },
        ],
      },
    },
    include: { messages: true },
  })

  return { user, conversation }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })

