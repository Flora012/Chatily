
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class GroupMembers extends Model { }

    GroupMembers.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "GroupMembers",
            timestamps: false,
            createdAt: true,
            updatedAt: false,
        }
    );


    

    return GroupMembers;
};
