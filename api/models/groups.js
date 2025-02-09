const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Groups extends Model {}

    Groups.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                defaultValue: "Unknown",
            },
            creator_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user", 
                    key: "id",
                }
            },
        },
        {
            sequelize,
            modelName: "Groups",
            timestamps: false,
            createdAt: "created_at",
            updatedAt: false,
        }
    );

    return Groups;
};
