const groupsService = require('../services/groupsService');

exports.createGroup = async (req, res) => {
    const { name, description, loggedInUserId } = req.body;
    

    if (!name || name.trim() === "") {
        return res.status(400).json({ error: "A csoport neve kötelező!" });
    }
    if (name.length > 50) {
        return res.status(400).json({ error: "A csoport neve maximum 50 karakter lehet!" });
    }
    if (description && description.length > 200) {
        return res.status(400).json({ error: "A csoport leírása maximum 200 karakter lehet!" });
    }

    try {
        
        
        const newGroup = await groupsService.createGroup(name, description, loggedInUserId);
        res.status(201).json(newGroup);
    } catch (error) {
        console.error("Hiba a csoport létrehozásakor a controllerben:", error);
        res.status(500).json({ error: "Hiba a csoport létrehozásakor" });
    }
};

exports.renameGroup = async (req, res) => {
    const { groupId } = req.params;
    const { newName } = req.body;
    try {
        await groupsService.renameGroup(groupId, newName);
        res.json({ message: 'Group renamed successfully' });
    } catch (error) {
        console.error('Error renaming group:', error);
        res.status(500).json({ error: 'Error renaming group' });
    }
};

exports.changeGroupDescription = async (req, res) => {
    const { groupId } = req.params;
    const { newDescription } = req.body;
    try {
        await groupsService.changeGroupDescription(groupId, newDescription);
        res.json({ message: 'Group description changed successfully' });
    } catch (error) {
        console.error('Error changing group description:', error);
        res.status(500).json({ error: 'Error changing group description' });
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

exports.deleteGroup = async (req, res, next) => {
    const { id } = req.params;

    try {
        await groupsService.deleteGroup(id);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        next(error);
    }
};
