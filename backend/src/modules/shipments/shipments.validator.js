const { z } = require('zod')

const createShipmentSchema = z.object({
  body: z.object({
    originAddress: z.string().min(5, 'Dirección de origen requerida'),
    originCity: z.string().min(2, 'Ciudad de origen requerida'),
    originLat: z.number().optional(),
    originLng: z.number().optional(),
    destinationAddress: z.string().min(5, 'Dirección de destino requerida'),
    destinationCity: z.string().min(2, 'Ciudad de destino requerida'),
    destinationLat: z.number().optional(),
    destinationLng: z.number().optional(),
    cargoType: z.string().optional(),
    paymentPreference: z.enum(['AL_RECOGER', 'AL_ENTREGAR']).optional(),
    totalPrice: z.number().positive().optional(),
    estimatedCollectionAt: z.string().datetime().optional(),
    bidDeadline: z.string().datetime().optional(),
    categoryId: z.number().optional(),
    items: z.array(z.object({
      name: z.string().min(1),
      category: z.enum(['pequeño', 'mediano', 'grande', 'extra_grande']),
      weightKg: z.number().optional(),
      lengthCm: z.number().optional(),
      widthCm: z.number().optional(),
      heightCm: z.number().optional(),
      isIrregular: z.boolean().default(false),
      difficulty: z.enum(['normal', 'moderada', 'alta']).default('normal'),
      basePrice: z.number(),
      difficultyCharge: z.number().default(0),
      irregularCharge: z.number().default(0),
      subtotal: z.number(),
      aiConfidence: z.number().optional(),
      priceNote: z.string().optional()
    })).optional()
  })
})

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      'PUBLISHED', 'ASSIGNED', 'IN_COLLECTION',
      'IN_TRANSIT', 'DELIVERED', 'CLOSED', 'CANCELLED'
    ]),
    changeReason: z.string().optional()
  }),
  params: z.object({
    id: z.string()
  })
})

const cancelSchema = z.object({
  body: z.object({
    reason: z.string().min(5, 'Debes indicar el motivo de cancelación')
  }),
  params: z.object({
    id: z.string()
  })
})

module.exports = { createShipmentSchema, updateStatusSchema, cancelSchema }
