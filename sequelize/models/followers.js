'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Followers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Followers.init({
    following: DataTypes.INTEGER,
    followed: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followers',
  });
  Followers.associate = function(models) {
    Followers.belongsTo(models.User, {as:'my_following',foreignKey:{name: 'following'}});
    Followers.belongsTo(models.User, {as:'my_followed',foreignKey: {name: 'followed'}});
  };
  return Followers;
};