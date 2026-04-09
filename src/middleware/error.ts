import type { MiddlewareHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const errorMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof HTTPException) {
      return err.getResponse()
    }

    const message = err instanceof Error ? err.message : 'Unexpected error'
    return c.json({ error: message }, 500)
  }
}

