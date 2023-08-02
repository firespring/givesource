'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      const updates = {
        deletedAt: new Date()
      }
      const where = {
        isDeleted: 1,
        deletedAt: null
      }
      const options = { transaction: t }

      await queryInterface.addColumn('Donations', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }, options)

      await queryInterface.bulkUpdate('Donations', updates, where, options)
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Donations', 'deletedAt', { transaction: t })
      ])
    })
  }
}
