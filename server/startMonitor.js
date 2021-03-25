const Urlmon = require('url-monitor')
const { services: defaultServices = [] } = require('./config/status.json')

module.exports = async function startMonitor (db) {
  const services = await db.models.service.findAll()
  await Promise.all(defaultServices.map(async ({ name, url, timeout, interval }) => {
    const lastRow = await db.models.service.findOne({ order: [['order', 'DESC']] })
    let order = 0
    if (lastRow) order = lastRow.order + 1

    return db.models.service.findOrCreate({ where: { name }, defaults: { name, url, timeout, interval, order } })
  }))

  services.forEach(service => {
    const { url, timeout, interval, id } = service
    const website = new Urlmon({ url, timeout, interval, successCodes: [200, 301, 302, 403] })

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
  })
}

function submit (db, id, { code, message, time, url }, good) {
  db.models.tick.create({ code, message, time, good, serviceId: id })
}
