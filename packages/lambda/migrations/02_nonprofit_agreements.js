'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await Promise.all([
            queryInterface.createTable('NonprofitAgreements', {
                agreementId: {
                    type: Sequelize.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                nonprofitId: {
                    type: Sequelize.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                isChecked: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                isDeleted: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
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
            }),
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await Promise.all([
            queryInterface.dropTable('NonprofitAgreements')
        ]);
    }
};
