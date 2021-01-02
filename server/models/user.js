"use strict";
const { Model } = require("sequelize");
const { encryptPassword } = require("../helper/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[a-zA-Z ]*$/,
            msg: "fullname may only contain letters and space",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Invalid Email Address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 18],
            msg: "Password must contain at least 6 characters",
          },
        },
      },
      enable2fa: DataTypes.BOOLEAN,
      secret2fa: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(instance, options) {
          instance.password = encryptPassword(instance.password);
        },
      },
    }
  );
  return User;
};
