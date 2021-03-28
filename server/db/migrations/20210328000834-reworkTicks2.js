'use strict'
const { fn, col, INTEGER, FLOAT, DATEONLY } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      const Tick = require('../models/tick')(queryInterface.sequelize)

      const dateFn = Sequelize.fn('date', Sequelize.col('createdAt'))
      const minFn = fn('MIN', fn('NULLIF', col('time'), 0))
      const maxFn = fn('MAX', col('time'))
      const avgFn = fn('AVG', col('time'))
      const nowFn = Sequelize.fn('now')

      const rows = await Tick.findAll({
        raw: true,
        attributes: [[dateFn, 'date'], 'serviceId', [minFn, 'min'], [maxFn, 'max'], [avgFn, 'avg']],
        group: [dateFn, 'serviceId']
      })

      await queryInterface.dropTable('ticks')
      await queryInterface.createTable('ticks', {
        date: {
          type: DATEONLY,
          primaryKey: true
        },
        serviceId: {
          type: INTEGER,
          primaryKey: true
        },
        average: FLOAT,
        min: FLOAT,
        max: FLOAT
      })

      return queryInterface.bulkInsert('ticks',
        rows.map(r => ({ ...r, createdAt: nowFn, updatedAt: nowFn }))
      )
    })
  },

  down: async (queryInterface, Sequelize) => {

  }
}
