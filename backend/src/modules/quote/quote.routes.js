const router = require('express').Router()
const { analyze, calculate } = require('./quote.controller')

router.post('/analyze', analyze)
router.post('/calculate', calculate)

module.exports = router
