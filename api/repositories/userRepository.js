const db = require("../db/dbContext");
const { Op } = require("sequelize"); // Sequelize operátorok



class UserRepository {
    constructor(db) {
        this.Users = db.User;
    }

    async createUser(user) {

    }
    async searchUsers(param) {
        return await this.Users.findAll({  
            where: {
                [Op.or]: [
                    { firstname: { [Op.like]: `%${param}%` } },
                    { lastname: { [Op.like]: `%${param}%` } }
                ]
            },
            attributes: ["id", "firstname", "lastname", "profilePicture","email"]
        });
    }
    


    // A többi metódus változatlan marad
    async getUserById(id) {
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

    async getUserByEmail(email) {
        return await this.Users.findOne({ where: { email } });
    }


    // Jelszóellenőrző függvény
    

}

module.exports = new UserRepository(db);
