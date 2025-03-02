const { Friendships, Notification, Users } = require("../models");
const { where } = require("sequelize");
const db = require("../db/dbContext");
const bcrypt = require('bcrypt'); // Importáld a bcrypt-ot a jelszó hasheléséhez
const { generateToken } = require("../utils/jwtUtils");

class NotifyRepository{

    constructor(db)
    {
        this.User = db.User;
    }


    async getUserByEmail(email) {
        return await this.User.findAll({  // ✅ Helyesen használjuk a `this.Users`-t
            where: {
                [Op.or]: [
                    { email: { [Op.like]: `%${email}%` } },
                ]
            },
            attributes: ["id"]
        });
    }
}


module.exports = new NotifyRepository(db)




