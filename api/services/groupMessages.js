const groupsRepository = require('../repositories/groupsRepository');

class GroupsService
{
    async createGroup(group)
    {
        return await groupsRepository.createGroup(group);
    }
    async getGroup(id)
    {
        return await groupsRepository.getGroup(id);
    }
    async updateGroup(id, group)
    {
        return await groupsRepository.updateGroup(id, group);
    }
    async deleteGroup(id)
    {
        return await groupsRepository.deleteGroup(id);
    }
}

module.exports = new GroupsService();