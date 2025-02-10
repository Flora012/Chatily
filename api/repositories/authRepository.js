const db = require("../db/dbContext");

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

    async getUsers()
    {
        return await this.User.findAll();
    }

}

module.exports = new UserRepository(db);