
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Blocks extends Model { }

    Blocks.init(
        {
            receiver_id: { 
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Blocks",
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    );



    return Blocks;
};
