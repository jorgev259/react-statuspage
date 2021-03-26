const sequelize = require('sequelize')

module.exports = {
  Query: require('./Query'),
  Mutation: require('./Mutation'),

  Service: {
    good: async (parent, args, { db }) => {
      const tick = await db.models.tick.findOne({ where: { serviceId: parent.id }, order: [['createdAt', 'DESC']] })
      return tick.good
    },
    state: async (parent, args, { db }) => (await db.models.tick.findOne({
      attributes: ['good'],
      where: { serviceId: parent.id },
      order: [['createdAt', 'DESC']]
    })).good,
    uptimeDays: (parent, { days }, { db }) => db.models.tick.findAll({
      where: {
        [sequelize.Op.and]: [
          { serviceId: parent.id },
          sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), {
            [sequelize.Op.gt]: sequelize.fn('DATE_SUB', sequelize.fn('NOW'), sequelize.literal(`INTERVAL ${days} DAY`))
          })
        ]
      },
      attributes: [
        [sequelize.fn('date', sequelize.col('createdAt')), 'day'],
        [sequelize.fn('avg', sequelize.col('good')), 'uptime'],
        [sequelize.fn('avg', sequelize.col('time')), 'responseTime']
      ],
      group: [sequelize.fn('date', sequelize.col('createdAt'))],
      order: [sequelize.fn('date', sequelize.col('createdAt'))]
    }),
    uptime: async (parent, { days }, { db }) => (await db.models.tick.findOne({
      where: {
        [sequelize.Op.and]: [
          { serviceId: parent.id },
          sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), {
            [sequelize.Op.gt]: sequelize.fn('DATE_SUB', sequelize.fn('NOW'), sequelize.literal(`INTERVAL ${days} DAY`))
          })
        ]
      },
      attributes: [
        [sequelize.fn('avg', sequelize.col('good')), 'value']
      ]
    })).dataValues.value * 100,

    responseTime: async (parent, { days }, { db }) => {
      return (await db.models.tick.findOne({
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
      })).dataValues
    }
  },
  Tick: {
    service: parent => parent.getService()
  },
  ReportDay: {
    day: parent => parent.dataValues.day,
    uptime: parent => parent.dataValues.uptime * 100,
    responseTime: parent => parent.dataValues.responseTime
  }
}
