'use strict';

const faker = require("faker");

let wikis = [];

for(let i = 1 ; i <= 15 ; i++){
  wikis.push({
    title: faker.random.words(),
    body: faker.lorem.sentence(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
