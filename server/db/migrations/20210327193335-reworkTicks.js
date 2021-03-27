'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.sequelize.sync()

      const dateFn = Sequelize.fn('date', Sequelize.col('createdAt'))
      const valueFn = [Sequelize.fn('avg', Sequelize.col('good')), 'value']
      const countFn = [Sequelize.fn('count', '*'), 'count']
      const nowFn = Sequelize.fn('now')

      const Tick = require('../models/tick')(queryInterface.sequelize)

      const rows = await Tick.findAll({
        attributes: [[dateFn, 'date'], 'serviceId', valueFn, countFn],
        group: [dateFn, 'serviceId']
      })

      const newRows = rows.map(r => {
        const { date, serviceId, count } = r.dataValues
        const value = r.dataValues.value || 0

        return {
          date,
          serviceId,
          count,
          score: Math.floor(count * parseFloat(value)),
          createdAt: nowFn,
          updatedAt: nowFn
        }
      })

      return Promise.all([
        queryInterface.bulkInsert('uptimes', newRows),
        queryInterface.removeColumn('ticks', 'code'),
        queryInterface.removeColumn('ticks', 'message'),
        queryInterface.removeColumn('ticks', 'good')
      ])
    })
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('tick', 'code', Sequelize.INTEGER),
      queryInterface.addColumn('tick', 'message', Sequelize.STRING),
      queryInterface.addColumn('tick', 'good', Sequelize.BOOLEAN)
    ])
  }
}
