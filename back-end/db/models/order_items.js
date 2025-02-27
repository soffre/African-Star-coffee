'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');

const order_items = sequelize.define('order_items', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'order_id cannot be null',
      },
      notEmpty: {
        msg: 'order_id cannot be empty'
      },
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'product',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'product_id cannot be null',
      },
      notEmpty: {
        msg: 'product_id cannot be empty'
      },
    }
  },
  price: {                    // this price is multiply by the quantity and add the shipping or tax on that
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'price cannot be null',
      },
      notEmpty: {
        msg: 'price cannot be empty'
      },
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'quantity cannot be null',
      },
      notEmpty: {
        msg: 'quantity cannot be empty'
      },
      isInt: {
        msg: 'quantity must be integer'
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
    modelName: 'order_items',
  })


module.exports = order_items