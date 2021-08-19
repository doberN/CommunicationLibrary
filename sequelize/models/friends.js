'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Friends.init({
    friend_one: DataTypes.INTEGER,
    friend_two: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Friends',
  });
  Friends.associate = function(models) {
    Friends.belongsTo(models.User, {as:'friendOne',foreignKey:{name: 'friend_one'}});
    Friends.belongsTo(models.User, {as:'friendTwo',foreignKey: {name: 'friend_two'}});
  };

  return Friends;
};