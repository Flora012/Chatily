const db = require("../db/dbContext");

class GroupMessagesRepository {
    constructor(db) {
        this.GroupMessages = db.models.GroupMessages;
        this.User = db.models.User;
        this.Groups = db.models.Groups;
    }

    async getGroupMessages() {
        return await this.GroupMessages.findAll()
    }

    async createGroupMessage(groupId, senderId, content) {
        return await this.GroupMessages.create({
            group_id: groupId,
            sender_id: senderId,
            content: content,
        });
    }
}

module.exports = new GroupMessagesRepository(db);
