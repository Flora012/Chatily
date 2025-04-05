
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define(
        "Notification",
        {
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            receiver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            group_id: { 
                type: DataTypes.INTEGER,
                allowNull: true, 
                references: {
                    model: 'Groups', 
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
        },
        {
            tableName: "Notifications",
            timestamps: true,
            underscored:true
        }
    );

    return Notification;
};
