
const groupMemberRepository = require("../repositories/groupMembersRepository");
const NotificationRepository = require("../repositories/notifyRepository"); 
const userRepository = require("../repositories/userRepository");
const {Notification} = require('../db/dbContext')
const notificationRepository = new NotificationRepository(Notification)

class GroupMemberService {

    async getGroupMembers(groupId) {
        const groupMembers = await groupMemberRepository.getGroupMembers(groupId);
        
        
    
        
        const filteredMembers = groupMembers.filter(member => member.status !== 'pending');
    
        return filteredMembers.map(member => ({
            user: {
                id: member.user.id,
                firstname: member.user.firstname,
                lastname: member.user.lastname,
            },
            role: member.role,
            user_id: member.user_id,
            nickname: member.nickname,
            status: member.status 
        }));
    }
    

    async checkIfAdmin(groupId, userId) {
        try {
            const member = await groupMemberRepository.getGroupMemberRole(userId, groupId);
            
            
            return member && member === 'admin';
        } catch (error) {
            console.error('Error checking if user is admin:', error);
            throw error;
        }
    }

    async updateNickname(memberId, nickname) {
        return await groupMemberRepository.updateNickname(memberId, nickname);
    }

    async removeMember(memberId) {
        return await groupMemberRepository.removeMember(memberId);
    }

    async getUsers() {
        return await groupMemberRepository.getUsers();
    }
    async getGroups(userId) { 
        return await groupMemberRepository.getGroups(userId);
    }
    async deleteGroupMember(groupId, userId) {
        try {
            await groupMemberRepository.deleteNotificationBySenderAndReceiver(groupId, userId);
        } catch (error) {
            console.error('Error deleting group member:', error);
            throw error;
        }
    }

    async removeModerator(userId, groupId) { 
        return await groupMemberRepository.removeModerator(userId, groupId);
    }

    async updateNickname(groupId, userId, nickname) { 
        return await groupMemberRepository.updateNickname(groupId, userId, nickname);
    }

    async makeModerator(userId, groupId) {
        return await groupMemberRepository.makeModerator(userId, groupId);
    }
    async addMember(member) {
        
        
        
        const newMember = await groupMemberRepository.addMember(member);
        
        const user = await userRepository.getUserById(member.user_id);
        
        const group = await groupMemberRepository.getGroup(member.group_id); 
        
        
        const loggedInUser = await userRepository.getUserById(member.loggedInUserId);

        if(member.role!=="admin"){

            await notificationRepository.createNotification({
                sender_id: member.loggedInUserId, 
                receiver_id: member.user_id, 
                type: "group_invitation",
                message: `${loggedInUser.firstname} ${loggedInUser.lastname} meghívott a(z) ${group.name} csoportba!`,
                group_id:member.group_id
            });
        }
    
        
        return newMember;
    }

    async updateStatus(userId, groupId, status) {
        try {
            
            await groupMemberRepository.updateStatus(userId, groupId, status);
        } catch (error) {
            console.error('Error updating group member status:', error);
            throw error;
        }
    }
    async getGroupMemberRole(userId, groupId) {
        try {
            return await groupMemberRepository.getGroupMemberRole(userId, groupId);
        } catch (error) {
            console.error('Error getting group member role:', error);
            throw error;
        }
    }

    
}

module.exports = new GroupMemberService();
