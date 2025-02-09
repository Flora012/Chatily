const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }
);



const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const { User, Groups, Messages, Friendships, GroupMembers, GroupMessages } = require("../models")(db.sequelize, DataTypes);

db.User = User;
db.Groups = Groups;
db.Messages = Messages;
db.Friendships = Friendships;
db.GroupMembers = GroupMembers;
db.GroupMessages = GroupMessages;

db.sequelize.sync({ force: true }) 

module.exports = db;
