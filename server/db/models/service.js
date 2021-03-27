const { DataTypes } = require('sequelize')
const { STRING, INTEGER, FLOAT, BOOLEAN } = DataTypes

module.exports = function (sequelize) {
  return sequelize.define('service', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: INTEGER
    },
    name: STRING,
    url: STRING,
    timeout: FLOAT,
    interval: FLOAT,
    order: INTEGER,
    state: BOOLEAN,
    ping: {
      type: BOOLEAN,
      default: false
    }
  })
}
