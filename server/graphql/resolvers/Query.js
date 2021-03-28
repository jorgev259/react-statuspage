const sequelize = require('sequelize')
const { title, footer } = require('../../config/status.json')

module.exports = {
  title: () => title,
  footer: () => footer,
  services: (parent, args, { db }) => db.models.service.findAll({ order: [['order', 'ASC']] }),
  service: (parent, { id }, { db }) => db.models.service.findByPk(id),

  uptime: async (parent, { days }, { db }) => (await db.models.uptime.findOne({
    raw: true,
    where: {
      date: {
        [sequelize.Op.gt]: sequelize.fn('DATE_SUB', sequelize.fn('NOW'), sequelize.literal(`INTERVAL ${days} DAY`))
      }
    },
    attributes: [
      [sequelize.fn('AVG', sequelize.literal('score / count * 100')), 'uptime']
    ]
  })).uptime
}
