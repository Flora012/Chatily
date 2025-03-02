const groupMessagesService = require('../services/groupMessagesService');

exports.createGroupMessage = async (req, res, next) => {
    const { sender_id, group_id, content } = req.body;

    try {
        const newGroupMessage = {
            sender_id,
            group_id,
            content,
            timestamp: new Date()
        };

        const createdMessage = await groupMessagesService.createGroupMessage(newGroupMessage);
        res.status(201).json(createdMessage);
    } catch (error) {
        next(error);
    }
};

exports.getGroupMessage = async (req, res, next) => {
    const { id } = req.params;

    try {
        const message = await groupMessagesService.getGroupMessage(id);

        if (!message) {
            return res.status(404).json({ error: "Group message not found" });
        }

        res.status(200).json(message);
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
