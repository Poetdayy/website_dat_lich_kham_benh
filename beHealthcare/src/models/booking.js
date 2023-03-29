'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Patient, { foreignKey: 'patientId' });
      Booking.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
    }
  };
  Booking.init({
    patientId: DataTypes.INTEGER,
    scheduleId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    medicalReason: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};