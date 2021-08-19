'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Chat.init({
    userId: DataTypes.INTEGER,
    domain: DataTypes.STRING,
    reply_idMessage: DataTypes.INTEGER,
    message: DataTypes.STRING,
    target: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    offensive: DataTypes.INTEGER,
    date:{
      type:DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'Chat',
  });
  Chat.associate = function(models) {
    Chat.belongsTo(models.User, {as:'name',foreignKey:{name: 'userId'}});
    Chat.belongsTo(Chat, {as:'reply',foreignKey:{name: 'reply_idMessage'}, onDelete: 'cascade' });
  };
  return Chat;
};