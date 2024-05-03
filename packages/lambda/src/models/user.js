'use strict'

const { DataTypes, Model } = require('sequelize')
const { isNumericType, isUuid, isEmail, isString } = require('../helpers/validation')
class User extends Model {}

module.exports = (sequelize) => {
  return User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail, notEmpty: true }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    nonprofitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    cognitoUsername: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cognitoUuid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      // Cognito is returning a v7 uuid as the cognitoUuid now and that version is not supported by sequelize
      // which was causing validation to fail. This has been changed to require a non-empty string instead for now.
      validate: { isString, notEmpty: true }
    }
  },
  { sequelize, modelName: 'User' })
}
