const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require('./User')(sequelize);
const Project = require('./Project')(sequelize);
const Task = require('./Task')(sequelize);
const Tag = require('./Tag')(sequelize);

// Associations
User.hasMany(Project, { foreignKey: 'userId', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

Task.belongsToMany(Tag, { through: 'TaskTags' });
Tag.belongsToMany(Task, { through: 'TaskTags' });

module.exports = { sequelize, User, Project, Task, Tag };
