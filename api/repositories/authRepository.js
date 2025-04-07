// authRepository.js
const { where } = require("sequelize");
const db = require("../db/dbContext");
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");

class UserRepository {
    constructor(db) {
        this.User = db.User;
    }

    async createUser(user) {
        const newUser = await this.User.build(user);

        await newUser.save();

        return newUser;
    }

    async getUserForLogin(email, password) {
        const user = await this.User.findOne({ where: { email } });

        if (user == null) {
            return 0;
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (isPasswordValid) {

            const data = { passwordValid: true, userId: user.id }
            return data;
        }
        else {
            const data = { passwordValid: false, userId: null }
            return data;
        }

    }


}

module.exports = new UserRepository(db);
