const groupMembersService = require('../services/groupMembersService');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await groupMembersService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

exports.deleteGroupMember = async (req, res, next) => {
    const { groupId, userId } = req.params;
    try {
        await groupMembersService.deleteGroupMember(groupId, userId);
        res.status(200).json({ message: "Group member deleted successfully" });
    } catch (error) {
        next(error);
    }
};

exports.checkIfAdmin = async (req, res) => {
    const { groupId, userId } = req.params;
    try {
        const isAdmin = await groupMembersService.checkIfAdmin(groupId, userId);
        
        
        res.json({ isAdmin });
    } catch (error) {
        console.error('Error checking if user is admin:', error);
        res.status(500).json({ error: 'Error checking if user is admin' });
    }
};

exports.createGroupMember = async (req, res, next) => {
    const { user_id, group_id, role, status } = req.body;
    try {
        const newGroupMember = await groupMembersService.addMember({ user_id, group_id, role, status, loggedInUserId: req.body.loggedInUserId });
        res.status(201).json(newGroupMember);
    } catch (error) {
        next(error);
    }
};

exports.getGroupMembers = async (req, res, next) => {
    const { groupId } = req.params;
    try {
        const groupMembers = await groupMembersService.getGroupMembers(groupId);
        
        
        res.status(200).json(groupMembers);
    } catch (error) {
        next(error);
    }
};

exports.getGroups = async (req, res, next) => { 
    const { userId } = req.params;
    try {
        const groups = await groupMembersService.getGroups(userId);
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};

exports.notifyGroupMember = async (req, res, next) => {
    const { user_id, group_id, role, status, loggedInUserId } = req.body;
    
    try {
        const newGroupMember = await groupMembersService.addMember({ user_id, group_id, role, status, loggedInUserId });
        
        res.status(201).json(newGroupMember);
    } catch (error) {
        next(error);
    }
};

exports.getGroupMemberRole = async (req, res, next) => { 
    const { userId, groupId } = req.params;
    try {
        const role = await groupMembersService.getGroupMemberRole(userId, groupId);
        res.status(200).json(role);
    } catch (error) {
        next(error);
    }
};

exports.makeModerator = async (req, res) => {
    const { userId, groupId } = req.params;
    try {
        await groupMembersService.makeModerator(userId, groupId);
        res.status(200).json({ message: 'Member made moderator successfully' });
    } catch (error) {
        console.error('Error making member a moderator:', error);
        res.status(500).json({ error: 'Failed to make member a moderator' });
    }
};

exports.updateNickname = async (req, res) => { 
    const { groupId, userId } = req.params; s
    const { nickname } = req.body;
    try {
        await groupMembersService.updateNickname(groupId, userId, nickname);
        res.status(200).json({ message: 'Nickname updated successfully' });
    } catch (error) {
        console.error('Error updating nickname:', error);
        res.status(500).json({ error: 'Failed to update nickname' });
    }
};

exports.removeModerator = async (req, res) => { 
    const { userId, groupId } = req.params;
    try {
        await groupMembersService.removeModerator(userId, groupId);
        res.status(200).json({ message: 'Member removed from moderator successfully' });
    } catch (error) {
        console.error('Error removing member from moderator:', error);
        res.status(500).json({ error: 'Failed to remove member from moderator' });
    }
};

