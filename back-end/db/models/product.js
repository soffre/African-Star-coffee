'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
const { default: slugify } = require('slugify');
const image = require('./image');
const product = sequelize.define('product', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'title cannot be null',
      },
      notEmpty: {
        msg: 'title cannot be empty'
      }
    }
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'shortDescription cannot be null',
      },
      notEmpty: {
        msg: 'shortDescription cannot be empty'
      }
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'description cannot be null',
      },
      notEmpty: {
        msg: 'description cannot be empty'
      }
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'slug cannot be null',
      },
      notEmpty: {
        msg: 'slug cannot be empty'
      }
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  roast_level: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'roast_level cannot be null',
      },
      notEmpty: {
        msg: 'roast_level cannot be empty'
      }
    }
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'origin cannot be null',
      },
      notEmpty: {
        msg: 'origin cannot be empty'
      }
    }
  },
  processing_method: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'processing_method cannot be null',
      },
      notEmpty: {
        msg: 'processing_method cannot be empty'
      }
    }
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'price cannot be null',
      },
      notEmpty: {
        msg: 'price cannot be empty'
      },
      isNumeric: {
        msg: 'price must be only number'
      }
    }
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'stock_quantity cannot be null',
      },
      notEmpty: {
        msg: 'stock_quantity cannot be empty'
      },
      isInt: {
        msg: 'stock_quantity must be integer only'
      }
    }
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'unit cannot be null',
      },
      notEmpty: {
        msg: 'unit cannot be empty'
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
  modelName: 'product',
  hooks: {
    beforeValidate: function (product, options) {
      product.slug = slugify(product.title, { lower: true })
    }
  }
})

product.hasMany(image, {
  foreignKey: 'product_id',
})
image.belongsTo(product,{
  foreignKey: 'product_id',
})

module.exports = product