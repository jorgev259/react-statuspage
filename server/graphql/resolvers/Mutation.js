const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server-express')
const Urlmon = require('url-monitor')
const submit = require('../../submitFn')

console.log(submit)

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

  website.start()
}
