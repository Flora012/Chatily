const db = require("../db/dbContext");

class UserRepository {
    constructor() {
        this.Users = db.Users;
    }

    async createUser(user) {
        return await this.Users.create(user);
    }

    async getUser(id) {
        return await this.Users.findOne({ where: { id } });
    }

    async getUsers() {
        return await this.Users.findAll();
    }

    async updateUser(id, user) {
        return await this.Users.update(user, { where: { id } });
    }

    async deleteUser(id) {
        return await this.Users.destroy({ where: { id } });
    }
}

module.exports = new UserRepository();