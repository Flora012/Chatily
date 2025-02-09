const db = require("../db/dbContext");
class FriendshipRepository {
    constructor(db) {
        this.Friendships = db.Friendships;
        this.User = db.User;
    }

    async createFriendship(friendship) {
        return await this.Friendships.create(friendship);
    }

    async getFriendship(id) {
        return await this.Friendships.findOne({
            where: { id },
            include: [{ model: this.User, as: "user" }, { model: this.User, as: "friend" }],
        });
    }

    async getAllFriendships() {
        return await this.Friendships.findAll({
            include: [{ model: this.User, as: "user" }, { model: this.User, as: "friend" }],
        });
    }

    async updateFriendship(id, friendship) {
        return await this.Friendships.update(friendship, {
            where: { id },
        });
    }

    async deleteFriendship(id) {
        return await this.Friendships.destroy({
            where: { id },
        });
    }
}

module.exports = new FriendshipRepository(db);