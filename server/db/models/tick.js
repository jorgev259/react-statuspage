const { DataTypes, BOOLEAN } = require('sequelize')
const { STRING, INTEGER, FLOAT } = DataTypes

module.exports = function (sequelize) {
  return sequelize.define('tick', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: INTEGER
    },
    code: INTEGER,
    time: FLOAT,
    message: STRING,
    good: BOOLEAN
  })
}
