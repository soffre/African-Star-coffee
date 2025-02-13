const {Sequelize} = require('sequelize');

const env = process.env.NODE_ENV || 'development' // this need to change to 'production in production time '
const config = require('./config')

const sequelize = new Sequelize(config[env])

module.exports = sequelize;