'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.createTable('Agreements', {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        agreementTitle: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        agreementText: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        isRequired: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        sortOrder: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          defaultValue: 0
        },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: '0000-00-00 00:00:00'
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: '0000-00-00 00:00:00'
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        }
      })
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.dropTable('Agreements')
    ])
  }
}
