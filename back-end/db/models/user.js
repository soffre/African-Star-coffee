'use strict';
const {
  Model,
  Sequelize,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcrypt');
const AppError = require('../../utils/appError');
const address = require('./address');
const orders = require('./orders');

const user = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('0', '1', '2'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'userType connot be null',
      },
      notEmpty: {
        msg: 'userType cannot be empty',
      },
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'firstName connot be null',
      },
      notEmpty: {
        msg: 'firstName cannot be empty',
      },
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'lastName connot be null',
      },
      notEmpty: {
        msg: 'lastName cannot be empty',
      },
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'email connot be null',
      },
      notEmpty: {
        msg: 'email cannot be empty',
      },
      isEmail: {
        msg: 'Invalid email id',
      }
    }
  },
  phoneNo: {
    type: DataTypes.NUMBER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'phone number cannot be null',
      },
      notEmpty: {
        msg: 'Phone number cannot be empty'
      },
      isInt: {
        msg: 'Must be an integer number of pennies'
      },
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'passoword connot be null',
      },
      notEmpty: {
        msg: 'passoword cannot be empty',
      },
    }
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    set(value) {
      if (this.password.length < 7) {
        throw new AppError("Passowrd length must be greater than 7",
          400
        )
      }
      if (value === this.password) {
        const hashPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashPassword);
      } else {
        throw new AppError(
          'Password and confirm password must be the same',
          400
        );

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
  modelName: 'user',
})

// user with address assocation
user.hasMany(address, {
  foreignKey: 'userId'
})
address.belongsTo(user, {
  foreignKey: 'userId',
  onDelete: 'cascade'
})

// user with order assocation
user.hasMany(orders, {
  foreignKey: 'userId'
})
orders.belongsTo(user, {
  foreignKey: 'userId'
})

module.exports = user;