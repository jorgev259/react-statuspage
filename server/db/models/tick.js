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
    average: FLOAT,
    min: FLOAT,
    max: FLOAT
  })
}
