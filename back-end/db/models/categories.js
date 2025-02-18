'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
const product = require('./product');
const slugify = require('slugify')

const categories = sequelize.define('categories', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNull: {
        msg: 'name cannot be null'
      },
      notEmpty: {
        msg: 'name cannot be empty'
      }
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNull: {
        msg: 'slug cannot be null'
      },
      notEmpty: {
        msg: 'slug cannot be empty'
      },
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNull: {
        msg: 'description cannot be null'
      },
      notEmpty: {
        msg: 'description cannot be empty'
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
  }
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'categories',
  hooks: {
    beforeValidate: function (category, options) {
      category.slug = slugify(category.name, { lower: true })
    }
  }
})

categories.hasMany(product, {
  foreignKey: 'category_id'
}),
  product.belongsTo(categories, {
    foreignKey: 'category_id',
    onDelete: 'cascade'
  })

module.exports = categories