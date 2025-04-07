const db = require("../db/dbContext");
const { GroupMembers } = require('../db/dbContext');

class GroupMessagesRepository {
    constructor(db) {
        this.GroupMessages = db.GroupMessages;
        this.User = db.User;
    }

    async createGroupMessage(groupMessage) {
        return await this.GroupMessages.create(groupMessage);
    }

    async getGroupMessagesByGroupId(groupId) {
        return await this.GroupMessages.findAll({
            where: { group_id: groupId },
            include: [{
                model: this.User,
                as: 'sender',
                attributes: ['id', 'firstname', 'lastname'],
                include: [{
                    model: GroupMembers,
                    as: 'groupMembersId',
                    where: { group_id: groupId },
                    attributes: ['nickname']
                }]
            }],
        });
    }

}

module.exports = new GroupMessagesRepository(db);
