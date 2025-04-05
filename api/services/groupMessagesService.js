
const groupMessagesRepository = require("../repositories/groupMessagesRepository");

class GroupMessagesService {
    async getGroupMessages() {
        return await groupMessagesRepository.getGroupMessages();
    }

    async createGroupMessage(groupMessage) {
        return await groupMessagesRepository.createGroupMessage(groupMessage);
    }

    async getGroupMessage(id) {
        return await groupMessagesRepository.getGroupMessage(id);
    }

    async deleteGroupMessage(id) {
        return await groupMessagesRepository.deleteGroupMessage(id);
    }

    async getGroupMessagesByGroupId(groupId) {
        return await groupMessagesRepository.getGroupMessagesByGroupId(groupId);
    }
}

module.exports = new GroupMessagesService();
