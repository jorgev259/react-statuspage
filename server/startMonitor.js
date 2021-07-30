const Urlmon = require('url-monitor')
const { services: defaultServices = [] } = require('./config/status.json')
const submit = require('./submitFn')

module.exports = async function startMonitor (db) {
  const services = await db.models.service.findAll()
  await Promise.all(defaultServices.map(async ({ name, url, timeout, interval }) => {
    const lastRow = await db.models.service.findOne({ order: [['order', 'DESC']] })
    let order = 0
    if (lastRow) order = lastRow.order + 1

    return db.models.service.findOrCreate({ where: { name }, defaults: { name, url, timeout, interval, order } })
  }))

  services.forEach(service => startService(service, db))
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
