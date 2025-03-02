
module.exports = (sequelize,DataTypes)=>{


    const User = require("./user")(sequelize, DataTypes);
    const Friendships = require("./friendships")(sequelize, DataTypes);
    const Messages = require("./messages")(sequelize, DataTypes);
    const Groups = require("./groups")(sequelize, DataTypes);
    const GroupMembers = require("./groupMembers")(sequelize, DataTypes);
    const GroupMessages = require("./groupMessages")(sequelize, DataTypes);
    const Notification = require("./notification")(sequelize, DataTypes);
    
    User.hasMany(Friendships, {
        foreignKey: "user_id",
        as: "friendships",
    });
    
    User.hasMany(Messages, {
        foreignKey: "sender_id",
        as: "sentMessages",
    });
    
    User.hasMany(Messages, {
        foreignKey: "receiver_id",
        as: "receivedMessages",
    });
    
    User.belongsToMany(Groups, {
        through: GroupMembers,
        foreignKey: "user_id",
        as: "groups",
    });
    
    User.hasMany(GroupMembers, {
        foreignKey: "user_id",
        as: "groupMembersId",
    });
    
    Groups.hasMany(GroupMembers, {
        foreignKey: "group_id",
        as: "groupId",
    });
    
    Friendships.belongsTo(User, {
        foreignKey: "user_id",
        as: "user",
    });
    
    Messages.belongsTo(User, {
        foreignKey: "sender_id",
        as: "sender",
    });
    
    Groups.belongsToMany(User, {
        through: GroupMembers,
        foreignKey: "group_id",
        as: "members",
    });
    
    GroupMembers.belongsTo(User, {
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
    
    GroupMessages.belongsTo(User, {
        foreignKey: "sender_id",
        as: "sender",
    });

    User.hasMany(Notification, { foreignKey: "sender_id", as: "sentNotifications" });
    User.hasMany(Notification, { foreignKey: "receiver_id", as: "receivedNotifications" });

    Notification.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
    Notification.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });
    
    return  {
        sequelize,
        User,
        Friendships,
        Messages,
        Groups,
        GroupMembers,
        GroupMessages,
        Notification,
    };
}

