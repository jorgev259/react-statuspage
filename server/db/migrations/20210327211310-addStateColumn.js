'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('services', 'state', {
      type: Sequelize.BOOLEAN,
      default: true
    }),

  down: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('services', 'state', Sequelize.BOOLEAN)
}
