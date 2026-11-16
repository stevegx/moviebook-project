import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/index.js'
import useDatabase from './lib/database/index.js'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { fileURLToPath } from 'node:url'
import { ForbiddenError } from './utils/errors.js'
import {
  auth,
  user,
  movies,
  feeds,
} from './routes/index.js'

const isProduction = process.env.NODE_ENV === 'production'
const swaggerDocument = YAML.load(fileURLToPath(new URL('../swagger.yaml', import.meta.url)))

const app = express()
const database = await useDatabase()

await database.connect()

const APP_PORT = Number(process.env.PORT || process.env.APP_PORT || '8000')
if (!Number.isInteger(APP_PORT) || APP_PORT < 1 || APP_PORT > 65535) {
  throw new Error('PORT or APP_PORT must be a valid port number.')
}
const APP_URL = process.env.APP_URL || 'http://localhost:8000'
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
const allowedOrigins = isProduction ? [FRONTEND_URL] : [FRONTEND_URL, 'http://127.0.0.1:5173']

app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = origin?.replace(/\/$/, '')

      if (!origin || allowedOrigins.includes(normalizedOrigin || '')) {
        callback(null, true)
        return
      }

      callback(new ForbiddenError('Origin not allowed'))
    },
    credentials: true,
  })
)
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (_req, res) => {
  if (!database.isConnected()) return res.status(503).json({ status: 'unavailable' })
  return res.json({ status: 'ok' })
})
app.use('/api/auth', auth)
app.use('/api/user', user)
app.use('/api/movies', movies)
app.use('/api/feeds', feeds)

app.use(errorHandler)

app.listen(APP_PORT, () => {
  console.log(`Server is running at ${APP_URL}`)
})

const cleanup = async () => {
  await database.disconnect()
  process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
