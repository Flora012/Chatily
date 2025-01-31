const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
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

// Helyesen importáljuk a modelleket
const models = require("../api/models"); // Nem hívjuk meg függvényként
const { Users, Groups, Messages, Friendships, GroupMembers, GroupMessages } = models;

db.Users = Users;
db.Groups = Groups;
db.Messages = Messages;
db.Friendships = Friendships;
db.GroupMembers = GroupMembers;
db.GroupMessages = GroupMessages;

db.sequelize.sync({ force: true });

module.exports = db;
