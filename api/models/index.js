const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "mysql",
});

const Users = require("./users")(sequelize, DataTypes);
const Friendships = require("./friendships")(sequelize, DataTypes);
const Messages = require("./messages")(sequelize, DataTypes);
const Groups = require("./groups")(sequelize, DataTypes);
const GroupMembers = require("./groupMembers")(sequelize, DataTypes);
const GroupMessages = require("./groupMessages")(sequelize, DataTypes);

Users.hasMany(Friendships, {
    foreignKey: "user_id",
    as: "friendships",
});

Users.hasMany(Messages, {
    foreignKey: "sender_id",
    as: "sentMessages",
});

Users.hasMany(Messages, {
    foreignKey: "receiver_id",
    as: "receivedMessages",
});

Users.belongsToMany(Groups, {
    through: GroupMembers,
    foreignKey: "user_id",
    as: "groups",
});

Users.hasMany(GroupMembers, {
    foreignKey: "user_id",
    as: "groupMembersId",
});

Groups.hasMany(GroupMembers, {
    foreignKey: "group_id",
    as: "groupId",
});

Friendships.belongsTo(Users, {
    foreignKey: "user_id",
    as: "user",
});

Messages.belongsTo(Users, {
    foreignKey: "sender_id",
    as: "sender",
});

Groups.belongsToMany(Users, {
    through: GroupMembers,
    foreignKey: "group_id",
    as: "members",
});

GroupMembers.belongsTo(Users, {
    foreignKey: "user_id",
    as: "user",
});

GroupMembers.belongsTo(Groups, {
    foreignKey: "group_id",
    as: "group",
});

GroupMessages.belongsTo(Groups, {
    foreignKey: "group_id",
    as: "group",
});

GroupMessages.belongsTo(Users, {
    foreignKey: "sender_id",
    as: "sender",
});

module.exports = {
    sequelize,
    Users,
    Friendships,
    Messages,
    Groups,
    GroupMembers,
    GroupMessages,
};
