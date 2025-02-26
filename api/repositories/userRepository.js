const db = require("../db/dbContext");
const { Op } = require("sequelize"); // Sequelize operátorok


class UserRepository {
    constructor(db) {
        this.Users = db.User;
    }

    async createUser(user) {

    }
    async searchUsers(query) {
        return await this.Users.findAll({
            where: {
                [Op.or]: [
                    { firstname: { [Op.like]: `%${query}%` } },
                    { lastname: { [Op.like]: `%${query}%` } }
                ]
            }
        });
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
