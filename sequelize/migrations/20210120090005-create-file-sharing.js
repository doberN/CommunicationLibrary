'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FileSharings', {
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
      fileTitle: {
        type: Sequelize.STRING
      },
      fileName: {
        type: Sequelize.STRING
      },
      filePath: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('FileSharings');
  }
};