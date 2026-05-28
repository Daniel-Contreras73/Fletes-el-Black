const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const TIERS = [
  { name: 'Socio Bronce', min: 0,     max: 2999  },
  { name: 'Socio Plata',  min: 3000,  max: 9999  },
  { name: 'Socio Oro',    min: 10000, max: Infinity },
]

const getTierInfo = (points) => {
  const current = TIERS.find(t => points >= t.min && points <= t.max)
  const next = TIERS.find(t => t.min > (current?.min ?? 0))
  return {
    tier: current?.name ?? 'Socio Bronce',
    nextTierThreshold: next?.min ?? null,
    pointsToNextTier: next ? Math.max(next.min - points, 0) : 0,
    progressPercent: next
      ? Math.min(Math.round(((points - (current?.min ?? 0)) / (next.min - (current?.min ?? 0))) * 100), 100)
      : 100,
  }
}

const getLoyaltySummary = async (userId) => {
  const freights = await prisma.freight.findMany({
    where: { shipperId: userId, status: { in: ['DELIVERED', 'CLOSED'] } },
    select: {
      id: true,
      trackingFolio: true,
      finalPrice: true,
      actualDeliveryAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  const history = freights.map(f => ({
    date: (f.actualDeliveryAt || f.updatedAt).toISOString(),
    description: 'Flete completado',
    folio: f.trackingFolio,
    points: Math.floor(Number(f.finalPrice ?? 0)),
  }))

  const totalPoints = history.reduce((sum, h) => sum + h.points, 0)
  const tierInfo = getTierInfo(totalPoints)

  return { points: totalPoints, ...tierInfo, history }
}

module.exports = { getLoyaltySummary }
