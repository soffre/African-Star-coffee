'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
const { ORDER_STATUS } = require('../../constant');
const order_items = require('./order_items');
const payment = require('./payment');

const orders = sequelize.define('orders', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'address',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'address_id cannot be null'
      },
      notEmpty: {
        msg: 'address_id cannot be empty'
      },
    }
  },
  orderStatus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: [ORDER_STATUS.processed.ordinal],
    values: [ORDER_STATUS.processed.ordinal, ORDER_STATUS.delivered.ordinal, ORDER_STATUS.shipped.ordinal],
  },
  orderStatusStr: {
    type: DataTypes.VIRTUAL,
    get() {
      let result = undefined
      _.forOwn(ORDER_STATUS, (value, key) => {
        if (value.ordinal === this.orderStatus) {
          result = key
        }
      })
      return result
    }
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'totalPrice cannot be null'
      },
      notEmpty: {
        msg: 'totalPrice cannot be empty'
      },
      isInt: {
        msg: 'totalPrice must be number only'
      }
    }
  },
  promoCode_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'promoCode',
      key: 'id'
    }
  },
  price_with_discount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  order_item_count: {
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
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
    modelName: 'orders',
  })

// orders with order_items assocation
orders.hasMany(order_items, {
  foreignKey: 'order_id'
})
order_items.belongsTo(orders, {
  foreignKey: 'order_id'
})

// orders with payment assocation
orders.hasOne(payment, {
  foreignKey: 'order_id'
})
payment.belongsTo(orders, {
  foreignKey: 'order_id'
})

module.exports = orders