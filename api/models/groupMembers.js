const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class GroupMembers extends Model {}

    GroupMembers.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "GroupMembers",
            timestamps: false,
            createdAt: "joined_at",
            updatedAt: false,
        }
    );

    // Alapértelmezett nickname beállítása a user neve alapján
    GroupMembers.addHook("beforeCreate", async (groupMember, options) => {
        const User = sequelize.models.Users;
        if (!groupMember.nickname) {
            const user = await User.findByPk(groupMember.user_id);
            if (user) {
                groupMember.nickname = user.name;
            }
        }
    });

    return GroupMembers;
};
