const groupRepository = require("../repositories/groupRepository");

class GroupService {
    async createGroup(group) {
        return await groupRepository.createGroup(group);
    }

    async getGroup(id) {
        return await groupRepository.getGroup(id);
    }

    async updateGroup(id, group) {
        return await groupRepository.updateGroup(id, group);
    }

    async deleteGroup(id) {
        return await groupRepository.deleteGroup(id);
    }
}

module.exports = new GroupService();
