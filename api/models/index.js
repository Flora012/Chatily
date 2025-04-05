
module.exports = (sequelize, DataTypes) => {
    const User = require("./user")(sequelize, DataTypes);
    const Friendships = require("./friendships")(sequelize, DataTypes);
    const Messages = require("./messages")(sequelize, DataTypes);
    const Groups = require("./groups")(sequelize, DataTypes);
    const GroupMembers = require("./groupMembers")(sequelize, DataTypes);
    const GroupMessages = require("./groupMessages")(sequelize, DataTypes);
    const Notification = require("./notification")(sequelize, DataTypes);
    const Nickname = require("./nicknames")(sequelize, DataTypes);
    const Blocks = require("./blocks")(sequelize, DataTypes);
    

    
    User.hasMany(Friendships, {
        foreignKey: "receiver_id",
        as: "friendshipsReceiver",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    User.hasMany(Friendships, {
        foreignKey: "sender_id",
        as: "friendshipsSender",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    User.belongsToMany(User, {
        through: Blocks,
        as: 'blockedUsers', 
        foreignKey: 'sender_id',
        otherKey: 'receiver_id',
    });

    User.belongsToMany(User, {
        through: Blocks,
        as: 'blockingUsers', 
        foreignKey: 'receiver_id',
        otherKey: 'sender_id',
    });

    User.hasMany(Messages, {
        foreignKey: "sender_id",
        as: "sentMessages",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    User.hasMany(Messages, {
        foreignKey: "receiver_id",
        as: "receivedMessages",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    User.belongsToMany(Groups, {
        through: GroupMembers,
        foreignKey: "user_id",
        as: "groups",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    User.hasMany(GroupMembers, {
        foreignKey: "user_id",
        as: "groupMembersId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    User.hasMany(Notification, {
        foreignKey: "sender_id",
        as: "sentNotifications",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    User.hasMany(Notification, {
        foreignKey: "receiver_id",
        as: "receivedNotifications",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    User.hasMany(Nickname, {
        foreignKey: "sender_id",
        as: "sentNicknames",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    User.hasMany(Nickname, {
        foreignKey: "receiver_id",
        as: "receivedNicknames",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    
    Friendships.belongsTo(User, {
        foreignKey: "receiver_id",
        as: "receiver",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    Friendships.belongsTo(User, {
        foreignKey: "sender_id",
        as: "sender",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    
    Messages.belongsTo(User, {
        foreignKey: "sender_id",
        as: "sender",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    Messages.belongsTo(User, {
        foreignKey: "receiver_id",
        as: "receiver",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    
    Groups.belongsToMany(User, {
        through: GroupMembers,
        foreignKey: "group_id",
        as: "members",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    Groups.hasMany(GroupMembers, {
        foreignKey: "group_id",
        as: "groupId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    
    GroupMembers.belongsTo(User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    GroupMembers.belongsTo(Groups, {
        foreignKey: "group_id",
        as: "group",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    
    GroupMessages.belongsTo(Groups, {
        foreignKey: "group_id",
        as: "group",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    GroupMessages.belongsTo(User, {
        foreignKey: "sender_id",
        as: "sender",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    
    Notification.belongsTo(User, {
        foreignKey: "sender_id",
        as: "sender",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    Notification.belongsTo(User, {
        foreignKey: "receiver_id",
        as: "receiver",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    Notification.belongsTo(Groups, {
        foreignKey: "group_id",
        as: "group",
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    });

    
    Nickname.belongsTo(User, {
        foreignKey: "sender_id",
        as: "sender",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    Nickname.belongsTo(User, {
        foreignKey: "receiver_id",
        as: "receiver",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });

    return {
        sequelize,
        User,
        Friendships,
        Messages,
        Groups,
        GroupMembers,
        GroupMessages,
        Notification,
        Blocks,
        Nickname
    };
};
