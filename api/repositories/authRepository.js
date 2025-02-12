const { where } = require("sequelize");
const db = require("../db/dbContext");
const bcrypt = require('bcrypt'); // Importáld a bcrypt-ot a jelszó hasheléséhez
const { generateToken } = require("../utils/jwtUtils");



class UserRepository
{
    constructor(db)
    {
        this.User = db.User;
    }

    async createUser(user)
    {
        const newUser = await this.User.build(user);

        await newUser.save();
        
        return newUser;
    }

    async getUserForLogin(email, password) {
        const user = await this.User.findOne({ where: { email } });
        console.log(user)
        if (user==null) {
            return 0; 
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        console.log(isPasswordValid)

        if(isPasswordValid)
        {
            
            return 1;
        }
        else{
            return 2;
        }
            
    }
    

}

module.exports = new UserRepository(db);