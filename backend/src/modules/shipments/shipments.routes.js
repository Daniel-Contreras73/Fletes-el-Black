const { Router } = require('express')
const shipmentsController = require('./shipments.controller')
const { authenticate, authorize } = require('../../middleware/auth')
const validate = require('../../middleware/validate')
const {
  createShipmentSchema,
  updateStatusSchema,
  cancelSchema
} = require('./shipments.validator')

const router = Router()

// POST /api/shipments — cliente crea un flete
router.post('/',
  authenticate,
  authorize('CLIENT', 'ADMIN'),
  validate(createShipmentSchema),
  shipmentsController.create
)

// GET /api/shipments — admin ve todos los fletes
router.get('/',
  authenticate,
  authorize('ADMIN'),
  shipmentsController.getAll
)

// GET /api/shipments/mine — usuario ve sus propios fletes
router.get('/mine',
  authenticate,
  shipmentsController.getMine
)

// GET /api/shipments/folio/:folio — seguimiento por folio (público)
router.get('/folio/:folio',
  shipmentsController.getByFolio
)

// GET /api/shipments/:id — ver detalle de un flete
router.get('/:id',
  authenticate,
  shipmentsController.getOne
)

// PATCH /api/shipments/:id/status — cambiar estado
router.patch('/:id/status',
  authenticate,
  validate(updateStatusSchema),
  shipmentsController.updateStatus
)

// PATCH /api/shipments/:id/cancel — cancelar flete
router.patch('/:id/cancel',
  authenticate,
  validate(cancelSchema),
  shipmentsController.cancel
)

// POST /api/shipments/:id/assign — asignar transportista
router.post('/:id/assign',
  authenticate,
  authorize('CLIENT', 'ADMIN'),
  shipmentsController.assignCarrier
)

module.exports = router