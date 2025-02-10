const authRepository  = require("../repositories/authRepository");
const userRepository = require("../repositories/userRepository")

class AuthService
{
    async getUsers()
    {
        return await authRepository.getUsers();
    }

    async createUser(user)
    {
        return await authRepository.createUser(user);
    }
    async getUserPhoneNumber(phoneNumber) {
        return await userRepository.getUserPhoneNumber(phoneNumber);
    }

    async getUserEmail(email) {
        return await userRepository.getUserEmail(email);
    }
}

module.exports = new AuthService();