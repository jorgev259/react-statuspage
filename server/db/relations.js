module.exports = sequelize => {
  const { tick, service } = sequelize.models
  tick.belongsTo(service)
}
