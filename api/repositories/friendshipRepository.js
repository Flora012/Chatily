const db = require("../db/dbContext");


class FriendshipRepository {
    constructor(db) {
        this.Friendships = db.Friendships;
    }

    async getPendingRequests(userId) {
        return await this.Friendships.findAll({
            where: { friend_id: userId, status: "pending" }
        });
    }
}

module.exports = new FriendshipRepository(db);
