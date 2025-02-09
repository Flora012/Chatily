const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:", { logging: false });

try
{
    sequelize.authenticate();

    console.log("Mocked Database Connected Successfully!");
}
catch(err)
{
    console.error("Mocked Database connection failed!");
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


const { User, Groups, Messages, Friendships, GroupMembers, GroupMessages } = require("../api/models")(db.sequelize,DataTypes);

db.User = User;
db.Groups = Groups;
db.Messages = Messages;
db.Friendships = Friendships;
db.GroupMembers = GroupMembers;
db.GroupMessages = GroupMessages;

module.exports = db;
