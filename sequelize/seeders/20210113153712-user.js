'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      { name: 'dober', password:'$2b$10$rQURcu3cejInxZmisqSyvufKCFiJUlc/175cwl7GFrNqUph.4ujMi', email:'dober1770@gmail.com', active:true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'chess', password:'$2b$10$rQURcu3cejInxZmisqSyvufKCFiJUlc/175cwl7GFrNqUph.4ujMi', email:'dober1770@gmail.com', active:true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'dodogo', password:'$2b$10$rQURcu3cejInxZmisqSyvufKCFiJUlc/175cwl7GFrNqUph.4ujMi', email:'dober1770@gmail.com', active:true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'moshe', password:'$2b$10$rQURcu3cejInxZmisqSyvufKCFiJUlc/175cwl7GFrNqUph.4ujMi', email:'dober1770@gmail.com', active:true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'david', password:'$2b$10$rQURcu3cejInxZmisqSyvufKCFiJUlc/175cwl7GFrNqUph.4ujMi', email:'dober1770@gmail.com', active:true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Shlomo', password:'$2b$10$rQURcu3cejInxZmisqSyvufKCFiJUlc/175cwl7GFrNqUph.4ujMi', email:'dober1770@gmail.com', active:true, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
