const db = require("../db/dbContext");

class UserRepository {
    constructor(db) {
        this.User = db.User;
    }

    async createUser(user) {
        return await this.User.create(user);
    }

    async getUser(id) {
        return await this.User.findOne({ where: { id } });
    }

    async getUsers() {
        return await this.User.findAll();
    }

    async updateUser(id, user) {
        return await this.User.update(user, { where: { id } });
    }

    async deleteUser(id) {
        return await this.User.destroy({ where: { id } });
    }
}

module.exports = new UserRepository(db);