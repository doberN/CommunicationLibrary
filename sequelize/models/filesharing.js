'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FileSharing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FileSharing.init({
    userId: DataTypes.INTEGER,
    domain: DataTypes.STRING,
    fileTitle: DataTypes.STRING,
    fileName: DataTypes.STRING,
    filePath: DataTypes.STRING,
    offensive: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    date:{
      type:DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'FileSharing',
  });
  FileSharing.associate = function(models) {
    FileSharing.belongsTo(models.User);
  };
  return FileSharing;
};