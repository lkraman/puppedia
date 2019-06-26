'use strict';
const faker = require("faker");
const bcrypt = require("bcryptjs");

let users = [];
const hash = bcrypt.genSaltSync();
const hashedPass = bcrypt.hashSync("111111", hash);

for (let i = 1; i <= 20; i++) {
  users.push({
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: faker.random.number({
      'min': 0,
      'max': 1
    })
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};