const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{

    class Nickname extends Model {};

    Nickname.init
    (
        {
            id:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            sender_id: {
                type: DataTypes.INTEGER,
                
                allowNull: false,
            },
            receiver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            nickname: 
            {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            
            
        },

        {
            sequelize,
            modelName: "Nickname",
            tableName: "Nickname",
            timestamps: false,
            createdAt: true,
        }
    )
    
    return Nickname;
}