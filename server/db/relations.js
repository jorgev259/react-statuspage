module.exports = sequelize => {
  const { tick, service, uptime } = sequelize.models

  tick.belongsTo(service, { onDelete: 'CASCADE' })
  uptime.belongsTo(service, { onDelete: 'CASCADE' })
}
