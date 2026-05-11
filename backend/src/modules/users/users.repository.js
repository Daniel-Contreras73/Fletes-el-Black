const prisma = require('../../config/prisma')

const findById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: { select: { userType: true } },
      isActive: true,
      createdAt: true
    }
  })
}

const findAll = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: { select: { userType: true } },
      isActive: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

const update = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: { select: { userType: true } },
      isActive: true
    }
  })
}

module.exports = { findById, findAll, update }
