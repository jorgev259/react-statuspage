module.exports = {
  createService: async (parent, args, { db }, info) => {
    const lastRow = await db.models.service.findOne({ order: [['order', 'DESC']] })
    let order = 0
    if (lastRow) order = lastRow.order + 1

    return db.models.service.create({ ...args, order })
  }
}
