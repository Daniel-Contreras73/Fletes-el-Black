require('dotenv').config()
const http = require('http')
const { Server } = require('socket.io')
const app = require('./src/app')

const PORT = process.env.PORT || 3000

// Crear servidor HTTP (necesario para Socket.IO)
const server = http.createServer(app)

// Inicializar Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
})

// Guardar instancia de io para usarla en módulos
app.set('io', io)

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})