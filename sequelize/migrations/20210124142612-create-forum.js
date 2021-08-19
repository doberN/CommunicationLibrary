'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Forums', {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', 
          key: 'id', 
        },
      },
      domain: {
        type: Sequelize.STRING
      },
      parent: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Forums', 
          key: 'id', 
        },
        onDelete: 'CASCADE',
      },
      reply_idForum:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Forums', 
          key: 'id', 
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.TEXT
      },
      offensive: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      date: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Forums');
  }
};