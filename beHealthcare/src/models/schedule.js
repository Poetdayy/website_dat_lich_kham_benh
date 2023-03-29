'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Doctor.hasMany(Schedule);
      Schedule.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
    }
  };
  Schedule.init({
    doctorId: DataTypes.INTEGER,
    workingDay: DataTypes.DATE,
    hour: DataTypes.STRING,
    currentPatients: DataTypes.INTEGER,
    maxPatients: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};