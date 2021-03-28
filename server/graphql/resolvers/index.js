const { fn, literal, Op, col } = require('sequelize')

module.exports = {
  Query: require('./Query'),
  Mutation: require('./Mutation'),

  Service: {
    uptimeDays: (parent, { days }, { db }) => db.models.uptime.findAll({
      raw: true,
      where: {
        serviceId: parent.id,
        date: {
          [Op.gt]: fn('DATE_SUB', fn('NOW'), literal(`INTERVAL ${days} DAY`))
        }
      },
      attributes: [
        'date',
        [literal('score / count * 100'), 'uptime']
      ],
      order: ['date']
    }),
    uptime: async (parent, { days }, { db }) => (await db.models.uptime.findOne({
      raw: true,
      where: {
        serviceId: parent.id,
        date: fn('DATE', fn('NOW'))
      },
      attributes: [
        [literal('score / count * 100'), 'uptime']
      ]
    })).uptime,

    responseTime: async (parent, { days }, { db }) => db.models.tick.findOne({
      raw: true,
      where: {
        serviceId: parent.id,
        date: {
          [Op.gt]: fn('DATE_SUB', fn('NOW'), literal(`INTERVAL ${days} DAY`))
        }
      },
      attributes: [
        [fn('MIN', col('min')), 'min'],
        [fn('MAX', col('max')), 'max'],
        [fn('AVG', literal('score / count')), 'avg']
      ],
      group: ['serviceId']
    })
  }
}
