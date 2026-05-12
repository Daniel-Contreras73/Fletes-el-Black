const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Roles base del sistema
  const adminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'Administrador', userType: 'ADMIN' }
  })

  const clientRole = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: 'Cliente', userType: 'CLIENT' }
  })

  const transporterRole = await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, name: 'Transportista', userType: 'TRANSPORTER' }
  })

  console.log('Roles creados:', adminRole.name, clientRole.name, transporterRole.name)

  // Usuario de prueba — admin
  const adminHash = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fletes.black' },
    update: {},
    create: {
      roleId: 1,
      firstName: 'Admin',
      lastName: 'Fletes',
      email: 'admin@fletes.black',
      passwordHash: adminHash,
      privacyPolicyAccepted: true
    }
  })

  // Usuario de prueba — cliente
  const clientHash = await bcrypt.hash('Cliente123!', 10)
  const client = await prisma.user.upsert({
    where: { email: 'cliente@fletes.black' },
    update: {},
    create: {
      roleId: 2,
      firstName: 'Cliente',
      lastName: 'Prueba',
      email: 'cliente@fletes.black',
      passwordHash: clientHash,
      privacyPolicyAccepted: true
    }
  })

  // Usuario de prueba — transportista
  const transporterHash = await bcrypt.hash('Transporte123!', 10)
  const transporter = await prisma.user.upsert({
    where: { email: 'transportista@fletes.black' },
    update: {},
    create: {
      roleId: 3,
      firstName: 'Transportista',
      lastName: 'Prueba',
      email: 'transportista@fletes.black',
      passwordHash: transporterHash,
      privacyPolicyAccepted: true
    }
  })

  console.log('Usuarios de prueba creados:')
  console.log('  Admin        → admin@fletes.black       / Admin123!')
  console.log('  Cliente      → cliente@fletes.black     / Cliente123!')
  console.log('  Transportista→ transportista@fletes.black / Transporte123!')
}

main()
  .catch((e) => { console.error('Seed falló:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
