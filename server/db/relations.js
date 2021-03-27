module.exports = sequelize => {
  const { tick, service, uptime } = sequelize.models

  tick.belongsTo(service)
  uptime.belongsTo(service)
}
