
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Friendships extends Model { }

    Friendships.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            receiver_id: { 
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Friendships",
            timestamps: false,
            createdAt: true,
            updatedAt: false,
        }
    );



    return Friendships;
};
