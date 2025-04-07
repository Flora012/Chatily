// authService.js
const authRepository = require("../repositories/authRepository");
const userRepository = require("../repositories/userRepository")

class AuthService {
    async getUserForLogin(email, password) {
        return await authRepository.getUserForLogin(email, password);
    }

    async createUser(user) {
        return await authRepository.createUser(user);
    }
}

module.exports = new AuthService();
