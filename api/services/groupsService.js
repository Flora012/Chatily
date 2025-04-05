
const groupsRepository = require("../repositories/groupsRepository");
const groupMembersService = require("./groupMembersService");
const { Notification, db } = require('../db/dbContext'); 
const NotifyRepository = require("../repositories/notifyRepository"); 

const notificationRepository = new NotifyRepository(Notification,db);


class GroupService {
    async createGroup(name, description, loggedInUserId) {
        try {
            
            
            const newGroup = await groupsRepository.createGroup({name, description, loggedInUserId});
            
            





            
            await groupMembersService.addMember({
                user_id: loggedInUserId,
                group_id: newGroup.id,
                role: "admin", 
                status:"accepted",
                loggedInUserId:loggedInUserId,
            });

            
            
            await notificationRepository.create({
                sender_id: loggedInUserId,
                receiver_id: loggedInUserId, 
                type: "group_created",
                message: `Sikeresen létrehoztad a(z) ${name} nevű csoportot!`,
            });

            return newGroup;
        } catch (error) {
            console.error("Hiba a csoport létrehozásakor a serviceben:", error);
            throw error;
        }
    };

    async deleteGroup(id) {
        try {
            
            await groupMembersService.deleteMembersByGroupId(id);

            
            await groupsRepository.deleteGroup(id);
            return { message: "Group deleted successfully" };
        } catch (error) {
            console.error("Hiba a csoport törlésénél a serviceben:", error);
            throw error;
        }
    }

    async renameGroup(groupId, newName) {
        try {
            await groupsRepository.renameGroup(groupId, newName);
        } catch (error) {
            console.error('Error renaming group in service:', error);
            throw error;
        }
    }

    async changeGroupDescription(groupId, newDescription) {
        try {
            await groupsRepository.changeGroupDescription(groupId, newDescription);
        } catch (error) {
            console.error('Error changing group description in service:', error);
            throw error;
        }
    }


    async getGroup(id) {
        return await groupsRepository.getGroup(id);
    }

    async updateGroup(id, group) {
        return await groupsRepository.updateGroup(id, group);
    }

    async deleteGroup(id) {
        return await groupsRepository.deleteGroup(id);
    }
}

module.exports = new GroupService();
