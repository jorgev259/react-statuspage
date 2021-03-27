const { DataTypes } = require('sequelize')
const { INTEGER, DATEONLY } = DataTypes

module.exports = function (sequelize) {
  return sequelize.define('uptime', {
    date: {
      type: DATEONLY,
      primaryKey: true
    },
    score: {
      type: INTEGER,
      default: 0
    },
    count: {
      type: INTEGER,
      default: 0
    },
    serviceId: {
      type: INTEGER,
      primaryKey: true
    }
  })
}
