const paymentsService = require('./payments.service')

const getMine = async (req, res, next) => {
  try {
    const payments = await paymentsService.getMyPayments(req.user.id)
    res.json(payments)
  } catch (err) {
    next(err)
  }
}

const savePreference = async (req, res, next) => {
  try {
    const { preference } = req.body
    if (!['AL_RECOGER', 'AL_ENTREGAR'].includes(preference)) {
      return res.status(400).json({ message: 'Preferencia inválida' })
    }
    await paymentsService.savePreference(req.params.freightId, req.user.id, preference)
    res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getMine, savePreference }
