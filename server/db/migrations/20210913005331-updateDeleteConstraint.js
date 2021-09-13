'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'ticks',
      'ticks_ibfk_1'
    )
    await queryInterface.addConstraint('ticks', {
      fields: ['serviceId'],
      type: 'foreign key',
      name: 'ticks_ibfk_1',
      references: {
        table: 'services',
        field: 'id'
      },
      onDelete: 'CASCADE'
    })

    await queryInterface.removeConstraint(
      'uptimes',
      'uptimes_ibfk_1'
    )
    await queryInterface.addConstraint('uptimes', {
      fields: ['serviceId'],
      type: 'foreign key',
      name: 'uptimes_ibfk_1',
      references: {
        table: 'services',
        field: 'id'
      },
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'ticks',
      'ticks_ibfk_1'
    )
    await queryInterface.addConstraint('ticks', {
      fields: ['serviceId'],
      type: 'foreign key',
      name: 'ticks_ibfk_1',
      references: {
        table: 'services',
        field: 'id'
      }
    })

    await queryInterface.removeConstraint(
      'uptimes',
      'uptimes_ibfk_1'
    )
    await queryInterface.addConstraint('uptimes', {
      fields: ['serviceId'],
      type: 'foreign key',
      name: 'uptimes_ibfk_1',
      references: {
        table: 'services',
        field: 'id'
      }
    })
  }
}
