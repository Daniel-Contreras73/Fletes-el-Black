const loyaltyService = require('./loyalty.service')

const getSummary = async (req, res, next) => {
  try {
    const data = await loyaltyService.getLoyaltySummary(req.user.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

module.exports = { getSummary }
