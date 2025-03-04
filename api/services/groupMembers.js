const groupMemberRepository = require("../repositories/groupMemberRepository");

class GroupMemberService {
    async addMember(member) {
        return await groupMemberRepository.addMember(member);
    }

    async getGroupMembers(groupId) {
        return await groupMemberRepository.getGroupMembers(groupId);
    }

    async updateNickname(memberId, nickname) {
        return await groupMemberRepository.updateNickname(memberId, nickname);
    }

    async removeMember(memberId) {
        return await groupMemberRepository.removeMember(memberId);
    }
}

module.exports = new GroupMemberService();
