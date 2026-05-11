const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Seguridad y utilidades
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Rutas
const authRoutes = require('./modules/auth/auth.routes')
const usersRoutes = require('./modules/users/users.routes')
const shipmentsRoutes = require('./modules/shipments/shipments.routes')

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/shipments', shipmentsRoutes)

// Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando' })
})

// Manejador de errores (siempre al final)
app.use(errorHandler)

module.exports = app