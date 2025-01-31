const db = require("../db/dbContext");
const { Friendships, Users } = require("../models");

class FriendshipRepository {
    constructor() {
        this.Friendships = db.Friendships;
        this.Users = db.Users;
    }

    async createFriendship(friendship) {
        return await this.Friendships.create(friendship);
    }

    async getFriendship(id) {
        return await this.Friendships.findOne({
            where: { id },
            include: [{ model: this.Users, as: "user" }, { model: this.Users, as: "friend" }],
        });
    }

    async getAllFriendships() {
        return await this.Friendships.findAll({
            include: [{ model: this.Users, as: "user" }, { model: this.Users, as: "friend" }],
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

module.exports = new FriendshipRepository();