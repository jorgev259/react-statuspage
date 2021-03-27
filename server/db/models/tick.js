const { DataTypes } = require('sequelize')
const { INTEGER, FLOAT } = DataTypes

module.exports = function (sequelize) {
  return sequelize.define('tick', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: INTEGER
    },
    time: FLOAT
  })
}
