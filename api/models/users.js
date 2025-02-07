const { Model } = require("sequelize");
const userRepository = require("../repositories/userRepository");

module.exports = (sequelize, DataTypes) =>
{

    class Users extends Model {};

    Users.init
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
            }
        },

        {
            sequelize,
            modelName: "Users",
            timestamps: false,
            createdAt: true,
            updatedAt: false,
        }
    )
    
    return Users;
}