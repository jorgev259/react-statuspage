'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('services', 'ping', {
      type: Sequelize.BOOLEAN,
      default: false
    })

    return queryInterface.bulkUpdate('services', { ping: false }, {})
  },

  down: queryInterface => queryInterface.removeColumn('services', 'ping')
}
