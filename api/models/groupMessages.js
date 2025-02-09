const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class GroupMessages extends Model {}

    GroupMessages.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Groups",
                    key: "id",
                },
            },
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "User",
                    key: "id",
                },
            },
            content: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "GroupMessages",
            timestamps: false,
        }
    );

    return GroupMessages;
};
