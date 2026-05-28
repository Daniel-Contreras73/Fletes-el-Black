const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const path = require('path')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Seguridad y utilidades
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Rutas
const authRoutes = require('./modules/auth/auth.routes')
const usersRoutes = require('./modules/users/users.routes')
const shipmentsRoutes = require('./modules/shipments/shipments.routes')
const quoteRoutes = require('./modules/quote/quote.routes')
const appointmentsRoutes = require('./modules/appointments/appointments.routes')
const clientsRoutes = require('./modules/clients/clients.routes')
const reportsRoutes = require('./modules/reports/reports.routes')
const packagesRoutes = require('./modules/packages/packages.routes')
const destinationsRoutes = require('./modules/destinations/destinations.routes')
const documentsRoutes = require('./modules/documents/documents.routes')
const loyaltyRoutes = require('./modules/loyalty/loyalty.routes')
const paymentsRoutes = require('./modules/payments/payments.routes')

// Archivos estáticos (documentos subidos)
app.use('/uploads', express.static(path.join('/app/uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/shipments', shipmentsRoutes)
app.use('/api/quote', quoteRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/clients', clientsRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/packages', packagesRoutes)
app.use('/api/destinations', destinationsRoutes)
app.use('/api/documents', documentsRoutes)
app.use('/api/loyalty', loyaltyRoutes)
app.use('/api/payments', paymentsRoutes)

// Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando' })
})

// Manejador de errores (siempre al final)
app.use(errorHandler)

module.exports = app