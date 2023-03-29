'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctor.belongsTo(models.User, { foreignKey: 'userId' });
      Doctor.belongsTo(models.Specialization, { foreignKey: 'specializationId' });
      Doctor.belongsTo(models.Clinic, { foreignKey: 'clinicId' })
    }
  };
  Doctor.init({
    userId: DataTypes.INTEGER,
    specializationId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    certificateImage: DataTypes.TEXT,
    numberPatients: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;

};

