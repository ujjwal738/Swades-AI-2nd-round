import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { errorMiddleware } from './middleware/error.js'
import { agentsRoute } from './routes/agents.js'
import { chatRoute } from './routes/chat.js'
import { healthRoute } from './routes/health.js'

const app = new Hono()

app.use(errorMiddleware)

app.route('/api', healthRoute)
app.route('/api/chat', chatRoute)
app.route('/api/agents', agentsRoute)

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 3000),
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${info.port}`)
  },
)

