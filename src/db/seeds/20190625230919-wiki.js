'use strict';
const faker = require("faker");

let wikis = [];

for (let i = 1; i <= 5; i++) {
  wikis.push({
    title: faker.lorem.words(),
    body: faker.lorem.sentence(),
    private: faker.random.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: faker.random.number({
      'min': 30,
      'max': 31
    })
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", null, {})
  }
};