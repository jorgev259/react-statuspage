const sequelize = require('sequelize')

module.exports = {
  Query: require('./Query'),
  Mutation: require('./Mutation'),

  Service: {
    uptimeDays: (parent, { days }, { db }) => db.models.uptime.findAll({
      raw: true,
      where: {
        serviceId: parent.id,
        date: {
          [sequelize.Op.gt]: sequelize.fn('DATE_SUB', sequelize.fn('NOW'), sequelize.literal(`INTERVAL ${days} DAY`))
        }
      },
      attributes: [
        'date',
        [sequelize.literal('score / count * 100'), 'uptime']
      ],
      order: ['date']
    }),
    uptime: async (parent, { days }, { db }) => (await db.models.uptime.findOne({
      raw: true,
      where: {
        serviceId: parent.id,
        date: sequelize.fn('DATE', sequelize.fn('NOW'))
      },
      attributes: [
        [sequelize.literal('score / count * 100'), 'uptime']
      ]
    })).uptime,

    responseTime: async (parent, { days }, { db }) => db.models.tick.findOne({
      raw: true,
      where: {
        [sequelize.Op.and]: [
          { serviceId: parent.id },
          sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), {
            [sequelize.Op.gt]: sequelize.fn('DATE_SUB', sequelize.fn('NOW'), sequelize.literal(`INTERVAL ${days} DAY`))
          })
        ]
      },
      attributes: [
        [sequelize.fn('avg', sequelize.col('time')), 'avg'],
        [sequelize.fn('max', sequelize.col('time')), 'max'],
        [sequelize.fn('min', sequelize.col('time')), 'min']
      ]
    })
  },
  Tick: {
    service: parent => parent.getService()
  }
}
