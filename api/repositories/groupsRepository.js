const db = require("../db/dbContext");

class GroupRepository {
    constructor(db) {
        this.Groups = db.Groups;
    }


    async getGroup(id) {
        return await this.Groups.findOne({
            where: {
                id: id,
            },
        });
    }
    async createGroup(name) {



        return await this.Groups.create({
            name: name.name,
            description: name.description,
            creator_id: name.loggedInUserId,
        });
    };


    async renameGroup(groupId, newName) {
        try {
            const group = await this.Groups.findByPk(groupId);
            if (!group) {
                throw new Error('Group not found');
            }
            group.name = newName;
            await group.save();
        } catch (error) {
            console.error('Error renaming group in repository:', error);
            throw error;
        }
    }

    async changeGroupDescription(groupId, newDescription) {
        try {
            const group = await this.Groups.findByPk(groupId);
            if (!group) {
                throw new Error('Group not found');
            }
            group.description = newDescription;
            await group.save();
        } catch (error) {
            console.error('Error changing group description in repository:', error);
            throw error;
        }
    }
}

module.exports = new GroupRepository(db);
