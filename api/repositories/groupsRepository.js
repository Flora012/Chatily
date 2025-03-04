const db = require("../db/dbContext");

class GroupRepository {
    constructor(db) {
        this.Groups = db.models.Groups;
    }

    async createGroup(group) {
        return await this.Groups.create(group);
    }
    async getGroup(id) {
        return await this.Groups.findOne({
            where: {
                id: id,
            },
        });
    }

    async updateGroup(id, group) {
        return await this.Groups.update(
            {
                name: group.name,
                description: group.description,
            },
            {
                where: {
                    id: id,
                },
            }
        );
    }

    async deleteGroup(id) {
        return await this.Groups.destroy({
            where: {
                id: id,
            },
        });
    }
}

module.exports = new GroupRepository(db);
