const { Router } = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const ctrl = require('./documents.controller')
const { authenticate, authorize } = require('../../middleware/auth')

const uploadsDir = '/app/uploads'
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png']
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()))
  }
})

const router = Router()

router.get('/mine', authenticate, ctrl.getMyDocuments)
router.get('/', authenticate, authorize('ADMIN'), ctrl.getAll)
router.post('/', authenticate, authorize('ADMIN'), upload.single('file'), ctrl.upload)
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.remove)

module.exports = router
