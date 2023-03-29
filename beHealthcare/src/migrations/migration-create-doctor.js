'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      specializationId: {
        type: Sequelize.INTEGER,
        references: { model: 'specializations', key: 'id' }
      },
      clinicId: {
        type: Sequelize.INTEGER,
        references: { model: 'clinics', key: 'id' }
      },
      certificateImage: {
        type: Sequelize.TEXT
      },
      numberPatients: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('doctors');
  }
};