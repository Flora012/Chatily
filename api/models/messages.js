const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    
    class Messages extends Model {};

    Messages.init
    (
        {
            id:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            sender_id:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            receiver_id:
            {
                type: DataTypes.INTEGER,
                allowNull:false,            
            },
            content:
            {
                type:DataTypes.STRING(200),
                allowNull:false,
            }


        },

        {
            sequelize,
            modelName: "Messages",
            timestamps: false,
            createdAt: true,
            updatedAt: false,
        }
    )

    return Messages;
}