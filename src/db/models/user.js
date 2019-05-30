'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: "Validation error: must be a valid email"}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },{});
  User.associate = function(models) {
   
  };
    return User;
};
 