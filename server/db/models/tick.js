const { DataTypes } = require('sequelize')
const { INTEGER, FLOAT, DATEONLY } = DataTypes

module.exports = function (sequelize) {
  return sequelize.define('tick', {
    date: {
      type: DATEONLY,
      primaryKey: true
    },
    serviceId: {
      type: INTEGER,
      primaryKey: true
    },
    score: { type: FLOAT, defaultValue: 0 },
    count: { type: INTEGER, defaultValue: 0 },
    min: { type: FLOAT, defaultValue: 0 },
    max: { type: FLOAT, defaultValue: 0 }
  })
}
