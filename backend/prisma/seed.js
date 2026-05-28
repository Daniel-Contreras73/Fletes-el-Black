const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Roles base del sistema
  const adminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: { name: 'Administrador', userType: 'ADMIN' },
    create: { id: 1, name: 'Administrador', userType: 'ADMIN' }
  })

  const clientRole = await prisma.role.upsert({
    where: { id: 2 },
    update: { name: 'Cliente', userType: 'CLIENT' },
    create: { id: 2, name: 'Cliente', userType: 'CLIENT' }
  })

  const transporterRole = await prisma.role.upsert({
    where: { id: 3 },
    update: { name: 'Transportista', userType: 'TRANSPORTER' },
    create: { id: 3, name: 'Transportista', userType: 'TRANSPORTER' }
  })

  console.log('Roles creados:', adminRole.name, clientRole.name, transporterRole.name)

  // Usuario de prueba — admin
  const adminHash = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fletes.black' },
    update: { roleId: 1 },
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

  // Fletes de prueba
  const flete1 = await prisma.freight.upsert({
    where: { trackingFolio: 'FLT-0001' },
    update: {},
    create: {
      trackingFolio: 'FLT-0001',
      shipperId: client.id,
      status: 'PUBLISHED',
      originAddress: 'Av. Insurgentes 123, Centro',
      originCity: 'Chetumal',
      destinationAddress: 'Calle 30 #45, Col. Centro',
      destinationCity: 'Chetumal',
      cargoType: 'Electrónico',
      basePrice: 350,
      finalPrice: 350,
      pricingMethod: 'AI',
      freightItems: {
        create: [
          { name: 'Televisión', category: 'grande', difficulty: 'normal', basePrice: 200, subtotal: 200 },
          { name: 'Caja de ropa', category: 'mediano', difficulty: 'normal', basePrice: 150, subtotal: 150 }
        ]
      }
    }
  })

  const flete2 = await prisma.freight.upsert({
    where: { trackingFolio: 'FLT-0002' },
    update: {},
    create: {
      trackingFolio: 'FLT-0002',
      shipperId: client.id,
      status: 'PUBLISHED',
      originAddress: 'Blvd. Bahía 500, Chetumal',
      originCity: 'Chetumal',
      destinationAddress: 'Carretera Cancún Km 12',
      destinationCity: 'Bacalar',
      cargoType: 'Muebles',
      basePrice: 480,
      finalPrice: 480,
      pricingMethod: 'AI',
      freightItems: {
        create: [
          { name: 'Sofá', category: 'extra_grande', difficulty: 'alta', basePrice: 280, subtotal: 280 },
          { name: 'Mesa de comedor', category: 'grande', difficulty: 'moderada', basePrice: 200, subtotal: 200 }
        ]
      }
    }
  })

  const flete3 = await prisma.freight.upsert({
    where: { trackingFolio: 'FLT-0003' },
    update: {},
    create: {
      trackingFolio: 'FLT-0003',
      shipperId: client.id,
      status: 'PUBLISHED',
      originAddress: 'Col. Magisterial, Chetumal',
      originCity: 'Chetumal',
      destinationAddress: 'Av. Heroes 200, Chetumal',
      destinationCity: 'Chetumal',
      cargoType: 'Cajas',
      basePrice: 200,
      finalPrice: 200,
      pricingMethod: 'AI',
      freightItems: {
        create: [
          { name: 'Cajas de mudanza (x5)', category: 'mediano', difficulty: 'normal', basePrice: 200, subtotal: 200 }
        ]
      }
    }
  })

  console.log(`Fletes de prueba creados: ${flete1.trackingFolio}, ${flete2.trackingFolio}, ${flete3.trackingFolio}`)
}

main()
  .catch((e) => { console.error('Seed falló:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
