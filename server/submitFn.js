const { DateTime } = require('luxon')

module.exports = function submit (db, serviceId, { code, message, time, url }, good) {
  const where = { serviceId, date: DateTime.now().toFormat('yyyy-LL-dd') }

  db.models.service.update({ state: good }, { where: { id: serviceId } })

  db.models.uptime.findOrCreate({ where }).then(([uptime]) => {
    if (good) uptime.score += 1
    uptime.count += 1
    uptime.save()
  })

  db.models.tick.findOrCreate({ where }).then(([tick]) => {
    tick.count += 1
    if (tick.min === 0 || time < tick.min) tick.min = time
    if (time > tick.max) tick.max = time
    if (time > 0) tick.score += time

    tick.save()
  })
}
