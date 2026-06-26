const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#6366f1'
    }
  });
};
