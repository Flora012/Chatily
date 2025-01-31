const db = require("../db/dbContext");

class GroupMemberRepository {
    constructor(db) {
        this.GroupMembers = db.models.GroupMembers;
    }

    async addMember(member) {
        return await this.GroupMembers.create(member);
    }

    async getGroupMembers(groupId) {
        return await this.GroupMembers.findAll({
            where: { group_id: groupId },
            include: [{ model: db.models.Users, as: "user" }],
        });
    }

    async updateNickname(memberId, nickname) {
        return await this.GroupMembers.update(
            { nickname },
            { where: { id: memberId } }
        );
    }

    async removeMember(memberId) {
        return await this.GroupMembers.destroy({ where: { id: memberId } });
    }
}

module.exports = new GroupMemberRepository(db);
