const groupsService = require('../services/groupsService');

exports.createGroup = async (req, res, next) => {
    const { name, description } = req.body;

    try {
        const newGroup = await groupsService.createGroup({ name, description });
        res.status(201).json(newGroup);
    } catch (error) {
        next(error);
    }
};

exports.getGroup = async (req, res, next) => {
    const { id } = req.params;

    try {
        const group = await groupsService.getGroup(id);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        res.status(200).json(group);
    } catch (error) {
        next(error);
    }
};

exports.updateGroup = async (req, res, next) => {
    const { id } = req.params;
    const groupData = req.body;

    try {
        const updatedGroup = await groupsService.updateGroup(id, groupData);
        res.status(200).json(updatedGroup);
    } catch (error) {
        next(error);
    }
};

exports.deleteGroup = async (req, res, next) => {
    const { id } = req.params;

    try {
        await groupsService.deleteGroup(id);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        next(error);
    }
};
