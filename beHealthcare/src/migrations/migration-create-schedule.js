'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: { 
        type: Sequelize.INTEGER,
        references: { model: 'doctors', key: 'id' }
      },
      workingDay: { 
        type: Sequelize.DATE 
      },    
      hour: { 
        type: Sequelize.STRING
      },
      currentPatients: { 
        type: Sequelize.INTEGER
      },
      maxPatients: { 
        type: Sequelize.INTEGER 
      },      
      price: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('schedules');
  }
};