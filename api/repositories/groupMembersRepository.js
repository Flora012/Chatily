
const db = require("../db/dbContext");

class GroupMembersRepository {
    constructor(db) {
        this.GroupMembers = db.GroupMembers;
        this.Groups = db.Groups;
        this.User = db.User;
    }

    async addMember(member) {
        const newMember =  await this.GroupMembers.create({
            user_id: member.user_id,
            group_id: member.group_id,
            role: member.role,
            status: member.status
        });
        
        return newMember;
    }
    async getGroupMemberRole(userId, groupId) {
        try {
            const groupMember = await this.GroupMembers.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId,
                },
                attributes: ['role'],
            });
    
            if (!groupMember) {
                return null; 
            }
            
            
            return groupMember.role;
        } catch (error) {
            console.error('Error getting group member role:', error);
            throw error;
        }
    }
    async deleteNotificationBySenderAndReceiver(groupId, userId) {
        try {
            
           return await this.GroupMembers.destroy({
               where: { group_id: groupId, user_id: userId },
           });
       } catch (error) {
           console.error("Error in deleteNotificationBySenderAndReceiver repository:", error);
           throw error;
       }
     }

     async getGroupMembers(groupId) {
        return await this.GroupMembers.findAll({
            where: { group_id: groupId },
            include: [{ model: this.User, as: "user", attributes: ['id','firstname','lastname'] }],
            attributes: ['user_id','role','nickname', 'status'], 
        });
    }

    async makeModerator(userId, groupId) {
        try {
            const groupMember = await this.GroupMembers.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId,
                },
            });
    
            if (!groupMember) {
                throw new Error('Group member not found');
            }
    
            groupMember.role = 'moderator';
            await groupMember.save();
        } catch (error) {
            console.error('Error making member a moderator:', error);
            throw error;
        }
    }
    async getGroups(userId) {
        const groups = await this.GroupMembers.findAll({
            where: { user_id: userId },
            include: [{
                model: this.Groups,
                as: 'group',
                attributes: ['id', 'name']
            }],
            attributes: ['status'], 
        });
        return groups.map(groupMember => ({
            id: groupMember.group.id,
            name: groupMember.group.name,
            status: groupMember.status, 
        }));
    }
    async deleteNotificationBySenderAndReceiver(groupId, userId) {
        try {
    
           return await this.GroupMembers.destroy({
               where: { group_id: groupId, user_id: userId },
           });
       } catch (error) {
           console.error("Error in deleteNotificationBySenderAndReceiver repository:", error);
           throw error;
       }
     }

     async deleteMembersByGroupId(groupId) {
        try {
            return await this.GroupMembers.destroy({
                where: { group_id: groupId },
            });
        } catch (error) {
            console.error("Error deleting group members:", error);
            throw error;
        }
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

    async getUsers() {
        return await this.User.findAll({
            attributes: ['id', 'firstname', 'lastname'],
        });
    }
    async getGroup(groupId) { 
        return await this.Groups.findByPk(groupId);
    }

    

    async updateStatus(userId, groupId, status) {
        try {
            const groupMember = await this.GroupMembers.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId,
                },
            });

            if (!groupMember) {
                throw new Error('Group member not found');
            }

            groupMember.status = status;
            await groupMember.save();
        } catch (error) {
            console.error('Error updating group member status:', error);
            throw error;
        }
    }
    async removeModerator(userId, groupId) {
        try {
            const groupMember = await this.GroupMembers.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId,
                },
            });
    
            if (!groupMember) {
                throw new Error('Group member not found');
            }
    
            groupMember.role = 'member';
            await groupMember.save();
        } catch (error) {
            console.error('Error removing member from moderator:', error);
            throw error;
        }
    }

    async updateNickname(groupId, userId, nickname) { 
        try {
            const groupMember = await this.GroupMembers.findOne({
                where: {
                    group_id: groupId,
                    user_id: userId,
                },
            });

            if (!groupMember) {
                throw new Error('Group member not found');
            }

            groupMember.nickname = nickname;
            await groupMember.save();
        } catch (error) {
            console.error('Error updating member nickname:', error);
            throw error;
        }
    }
}

module.exports = new GroupMembersRepository(db);
