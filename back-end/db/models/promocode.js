'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
const orders = require('./orders');

const promoCode = sequelize.define('promoCode', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'code cannot be null'
      },
      notEmpty: {
        msg: 'code cannot be empty'
      },
      isAlphanumeric: {
        msg: 'code can only be alpha numberic'
      }
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isAlphanumeric: {
        msg: 'description can only be alpha numberic'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  max_usage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'max_usage cannot be null'
      },
      notEmpty: {
        msg: 'max_usage cannot be empty'
      },
      isInt: {
        msg: 'max_usage is not integer'
      }
    }
  },
  discount_percent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'discount_percent cannot be null'
      },
      notEmpty: {
        msg: 'discount_percent cannot be empty'
      },
      isInt: {
        msg: 'discount_percent is not integer'
      }
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  },
},
  {
    paranoid: true,
    freezeTableName: true,
    modelName: 'promoCode',
  })

promoCode.hasMany(orders, {
  foreignKey: 'promoCode_id'
})
orders.belongsTo(promoCode, {
  foreignKey: 'promoCode_id'
})

module.exports = promoCode