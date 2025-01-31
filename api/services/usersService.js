const userRepository = require("../repositories/userRepository");

class UserService {
    async createUser(user) {
        return await userRepository.createUser(user);
    }

    async getUser(id) {
        return await userRepository.getUser(id);
    }

    async updateUser(id, user) {
        return await userRepository.updateUser(id, user);
    }

    async deleteUser(id) {
        return await userRepository.deleteUser(id);
    }
}

module.exports = new UserService();
