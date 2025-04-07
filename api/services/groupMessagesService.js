const groupMessagesRepository = require("../repositories/groupMessagesRepository");

class GroupMessagesService {
    async createGroupMessage(groupMessage) {
        return await groupMessagesRepository.createGroupMessage(groupMessage);
    }

    async getGroupMessagesByGroupId(groupId) {
        return await groupMessagesRepository.getGroupMessagesByGroupId(groupId);
    }
}

module.exports = new GroupMessagesService();
