import type { MiddlewareHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { Prisma } from '@prisma/client'

export const errorMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof HTTPException) {
      return err.getResponse()
    }

    const isPrismaInitError =
      err instanceof Prisma.PrismaClientInitializationError ||
      (typeof err === 'object' &&
        err !== null &&
        'name' in err &&
        typeof (err as any).name === 'string' &&
        (err as any).name.includes('PrismaClientInitializationError'))

    if (isPrismaInitError) {
      const details = err instanceof Error ? err.message : undefined
      return c.json(
        {
          error:
            'Database connection failed. Check DATABASE_URL and ensure the database is reachable (Supabase network/pooler settings).',
          details,
        },
        500,
      )
    }

    const message = err instanceof Error ? err.message : 'Unexpected error'
    return c.json({ error: message }, 500)
  }
}

