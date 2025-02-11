const db = require("../db/dbContext");

class UserRepository {
    constructor(db) {
        this.Users = db.User;
    }

    async createUser(user) {
        const passwordValidation = isPasswordValid(user.password);
        if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
        }

        return await this.Users.create(user);
    }

    // A többi metódus változatlan marad
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

    async getUserPhoneNumber(phoneNumber) {
        return await this.Users.findOne({ where: { phoneNumber } });
    }

    async getUserEmail(email) {
        return await this.Users.findOne({ where: { email } });
    }

    // Jelszóellenőrző függvény
    

}

module.exports = new UserRepository(db);
