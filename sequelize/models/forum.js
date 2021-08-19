'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Forum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Forum.init({
    userId: DataTypes.INTEGER,
    domain: DataTypes.STRING,
    parent: DataTypes.INTEGER,
    reply_idForum:DataTypes.INTEGER,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    offensive: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    date:{
      type:DataTypes.DATE,
       defaultValue: DataTypes.NOW},
  }, {
    sequelize,
    modelName: 'Forum',
  });
  Forum.associate = function(models) {
    Forum.belongsTo(models.User, {as:'name',foreignKey:{name: 'userId'}});
    Forum.belongsTo(Forum, {as:'reply',foreignKey:{name: 'reply_idForum'}, onDelete: 'cascade' });
    Forum.hasMany(Forum, {as:'response',foreignKey:{name: 'parent'},onDelete: 'cascade'});

  };
  return Forum;
};