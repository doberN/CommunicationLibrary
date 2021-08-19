'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Chats', {
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
      message: {
        type: Sequelize.STRING
      },
      reply_idMessage: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Chats', 
          key: 'id', 
        },  
        onDelete: 'CASCADE',
      },
      target: {
        type: Sequelize.INTEGER
      },
      read: {
        type: Sequelize.BOOLEAN
      },
      offensive: {
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
    await queryInterface.dropTable('Chats');
  }
};