'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');


const address = sequelize.define('address', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'firstName cannot be null'
      },
      notEmpty:{
        msg: 'firstName cannot be empty'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'lastName cannot be null'
      },
      notEmpty:{
        msg: 'lastName cannot be empty'
      }
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'address cannot be null'
      },
      notEmpty:{
        msg: 'address cannot be empty'
      },
    }
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'city cannot be null'
      },
      notEmpty:{
        msg: 'city cannot be empty'
      },
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'country cannot be null'
      },
      notEmpty:{
        msg: 'country cannot be empty'
      },
      isIn: {
        args: [['ethiopia', 'Eritrea','djibutti']],// update this when all country are specified on the constant file
        msg: 'Unsupported country'
      }
    }
  },
  zip_code: {
    type: DataTypes.STRING
  },
  region: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.NUMBER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'phone cannot be null'
      },
      notEmpty:{
        msg: 'phone cannot be empty'
      },
      isNumeric: {
        msg: 'phone must be number'
      }
    }
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
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
},{
  paranoid: true,
  freezeTableName: true,
  modelName: 'address',
})

module.exports = address