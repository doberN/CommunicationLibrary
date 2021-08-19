'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Chats', [
      { userId:1, domain:'http://localhost:3000/', message:"whats up", createdAt: new Date(), updatedAt: new Date() },
      { userId:2, domain:'http://localhost:3000/', message:"good morning", createdAt: new Date(), updatedAt: new Date() },
      { userId:3, domain:'http://localhost:3000/', message:"hi there", createdAt: new Date(), updatedAt: new Date() },
      { userId:3, domain:'http://localhost:3000/', message:"do somthing", createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Chats', null, {});
  }
};
