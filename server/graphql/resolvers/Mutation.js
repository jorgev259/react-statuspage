const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server-express')
const Urlmon = require('url-monitor')
const submit = require('../../submitFn')
const { Op } = require('sequelize')

module.exports = {
  createService: async (parent, args, { db, user }, info) => {
    if (!user) throw new AuthenticationError()

    const lastRow = await db.models.service.findOne({ order: [['order', 'DESC']] })
    let order = 0
    if (lastRow) order = lastRow.order + 1

    const service = await db.models.service.create({ ...args, order })
    startService(service, db)

    return service
  },
  updateService: async (parent, { id, options }, { db, user }) => {
    if (!user) throw new AuthenticationError()

    const row = await db.models.service.findByPk(id)
    for (const [key, value] of Object.entries(options)) {
      row[key] = value
    }
    await row.save()
    setTimeout(() => process.exit(), 10 * 1000)
    return row
  },
  updateOrder: async (parent, { id, destination }, { db, user }) => {
    if (!user) throw new AuthenticationError()

    db.transaction(async (t1) => {
      const item = await db.models.service.findByPk(id)
      const verb = destination < item.order ? 'increment' : 'decrement'
      const options = destination < item.order
        ? { [Op.and]: [{ order: { [Op.lt]: item.order } }, { order: { [Op.gte]: destination } }] }
        : { [Op.and]: [{ order: { [Op.gt]: item.order } }, { order: { [Op.lte]: destination } }] }

      const rows = await db.models.service.findAll({ where: options })
      await Promise.all(rows.map(r => r[verb]('order', { by: 1 })))

      item.order = destination
      await item.save()

      return 1
    })
  },

  login: (parent, { key }, context) => {
    if (process.env.ADMIN_KEY === key) return jwt.sign({}, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' })
    else throw new Error('Failed login')
  }
}

function startService (service, db) {
  const { url, timeout, interval, id, ping } = service
  const website = new Urlmon({ url, timeout, interval, successCodes: [200, 301, 302, 403], ping })

  website.on('error', data => {
    submit(db, id, data, false)
  })

  website.on('available', data => {
    submit(db, id, data, true)
  })

  website.on('unavailable', data => {
    submit(db, id, data, false)
  })

  // website.start()
}
