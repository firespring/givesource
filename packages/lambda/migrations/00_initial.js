'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Settings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			key: {
				type: Sequelize.STRING
			},
			value: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false
			}
		}).then(
			queryInterface.createTable('Contents', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE
				},
				isDeleted: {
					type: Sequelize.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				parentId: {
					type: Sequelize.INTEGER
				},
				sortOrder: {
					type: Sequelize.INTEGER
				},
				type: {
					type: Sequelize.STRING
				},
				value: {
					type: Sequelize.STRING
				},
				name: {
					type: Sequelize.STRING
				}
			})
		);
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Settings').then(
			queryInterface.dropTable('Contents')
		);;
	}
};
