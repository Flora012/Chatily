const { dataTagErrorSymbol } = require("@tanstack/react-query");
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

            firstname: 
            {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            lastname:
            {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            passwordHash:
            {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            email: 
            {
                type: DataTypes.STRING(40),
                allowNull: true,
            },
            profilePicture:
            {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            phoneNumber:
            {
                type: DataTypes.STRING(40),
                allowNull: true,
            },
            emailHash:
            {
                type: DataTypes.STRING,
                allowNull: true,
            },
            passwordResetTokenExpiry: {
                type: DataTypes.DATE,
                allowNull: true, 
            },
            
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