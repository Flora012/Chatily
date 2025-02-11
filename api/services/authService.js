const authRepository  = require("../repositories/authRepository");
const userRepository = require("../repositories/userRepository")

class AuthService
{
    async getUserForLogin(email, password)
    {
        return await authRepository.getUserForLogin(email, password);
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