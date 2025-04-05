const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Messages extends Model {
        static associate(models) {
            Messages.belongsTo(models.User, {
                foreignKey: 'sender_id',
                as: 'sender' 
            });
            Messages.belongsTo(models.User, {
                foreignKey: 'receiver_id',
                as: 'receiver' 
            });
        }
    };

    Messages.init({
        id: {
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
        content: {
            type: DataTypes.STRING(200),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "Messages",
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    });

    return Messages;
};
