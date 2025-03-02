const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{

    class Friendships extends Model {};

    Friendships.init
    (
        {
            id:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            user_id:
            {
                type: DataTypes.INTEGER ,
                allowNull: false,
            },
            friend_id:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status:
            {
                type: DataTypes.STRING(30),
                allowNull: false,
            }
        },

        {
            sequelize,
            modelName: "Friendships",
            timestamps: false,
            createdAt: true,
            updatedAt: false,
        }
    )

    return Friendships


}