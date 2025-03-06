const db = require("../db/dbContext");

class FriendshipRepository {
    constructor(db) {
        this.Friendships = db.Friendships;
    }

    async getPendingRequests(userId, friendId) {
        return await this.Friendships.findAll({
            where: {
                status: "pending",
                [db.Sequelize.Op.or]: [
                    { user_id: userId, friend_id: friendId },
                    { user_id: friendId, friend_id: userId }
                ]
            }
        });
    }
}

module.exports = new FriendshipRepository(db);
