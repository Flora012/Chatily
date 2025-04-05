const groupMessagesService = require("../services/groupMessagesService");

exports.getGroupMessages = async (req, res, next) => {
    try {
        const groupMessages = await groupMessagesService.getGroupMessages();
        res.status(200).json(groupMessages);
    } catch (error) {
        next(error);
    }
};

exports.createGroupMessage = async (req, res, next) => {
    const { group_id, sender_id, content } = req.body;
    try {
        const groupMessage = await groupMessagesService.createGroupMessage({ group_id, sender_id, content });
        res.status(201).json(groupMessage);
    } catch (error) {
        next(error);
    }
};

exports.getGroupMessage = async (req, res, next) => {
    const { id } = req.params;
    try {
        const groupMessage = await groupMessagesService.getGroupMessage(id);
        if (!groupMessage) {
            return res.status(404).json({ message: "Group message not found" });
        }
        res.status(200).json(groupMessage);
    } catch (error) {
        next(error);
    }
};

exports.deleteGroupMessage = async (req, res, next) => {
    const { id } = req.params;
    try {
        await groupMessagesService.deleteGroupMessage(id);
        res.status(200).json({ message: "Group message deleted successfully" });
    } catch (error) {
        next(error);
    }
};

exports.getGroupMessagesByGroupId = async (req, res, next) => {
    const { groupId } = req.params;
    try {
        const groupMessages = await groupMessagesService.getGroupMessagesByGroupId(groupId);
        res.status(200).json(groupMessages);
    } catch (error) {
        next(error);
    }
};
