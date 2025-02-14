const bcrypt = require('bcrypt')
module.exports = {
  up: (queryInterface, Sequelize) => {
    let password = process.env.ADMIN_PASSOWRD
    const hashPassword = bcrypt.hashSync(password, 10);
    return queryInterface.bulkInsert('user', [
      {
        userType: '0',
        firstName: process.env.ADMIN_FIRSTNAME,
        lastName: process.env.ADMIN_LASTNAME,
        email: process.env.ADMIN_EMAIL,
        phoneNo: process.env.ADMIN_PHONE_NO,
        password: hashPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', {userType: '0'}, {});
  },
};