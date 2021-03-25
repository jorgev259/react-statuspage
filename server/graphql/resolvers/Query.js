const sequelize = require('sequelize')
const { title, footer } = require('../../config/status.json')

module.exports = {
  title: () => title,
  footer: () => footer,
  services: (parent, args, { db }) => db.models.service.findAll(),
  service: (parent, { id }, { db }) => db.models.service.findByPk(id),

  ticks: (parent, args, { db }, info) => db.models.tick.findAll(),

  uptime: async (parent, { days }, { db }) => (await db.models.tick.findOne({
    where: sequelize.where(
      sequelize.fn('date', sequelize.col('createdAt')), {
        [sequelize.Op.gt]: sequelize.fn('DATE_SUB', sequelize.fn('NOW'), sequelize.literal(`INTERVAL ${days} DAY`))
      }
    ),
    attributes: [
      [sequelize.fn('avg', sequelize.col('good')), 'value']
    ]
  })).dataValues.value * 100
}
