const glob = require('glob')
const Sequelize = require('sequelize')
const path = require('path')

const cls = require('cls-hooked')
const namespace = cls.createNamespace('trans-namespace')

Sequelize.useCLS(namespace)

const config = require('../config/sequelize.json').mysql
const sequelize = new Sequelize(config)

glob.sync(path.join(__dirname, 'models/*')).forEach(e => require(e)(sequelize))
require(path.join(__dirname, 'relations'))(sequelize)

module.exports = sequelize
