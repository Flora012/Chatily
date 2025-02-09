const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{

    class User extends Model {};

    User.init
    (
        {
            id:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            name: 
            {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            passwordHash:
            {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            email: 
            {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            profilePicture:
            {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            phoneNumber:
            {
                type: DataTypes.STRING(40),
                allowNull: false,
            }
        },

        {
            sequelize,
            modelName: "User",
            tableName: "User",
            timestamps: false,
            createdAt: true,
        }
    )
    
    return User;
}