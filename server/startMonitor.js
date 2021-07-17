const Urlmon = require('url-monitor')
const { literal } = require('sequelize')
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
  })
}

async function submit (db, serviceId, { code, message, time, url }, good) {
  const where = {
    date: literal('DATE(NOW())'),
    serviceId
  }
  db.models.service.update({ state: good }, { where: { id: serviceId } })

  db.models.uptime.findOrCreate({ where }).then(async ([uptime]) => {
    if (good) uptime.score += 1
    uptime.count += 1

    await uptime.save()
  })

  db.models.tick.findOrCreate({ where }).then(async ([tick]) => {
    tick.count += 1
    if (tick.min === 0 || time < tick.min) tick.min = time
    if (time > tick.max) tick.max = time
    if (time > 0) tick.score += time

    await tick.save()
  })
}
