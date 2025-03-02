const messagesService = require('../services/messagesService');

exports.createMessage = async (req, res, next) => {
    const { sender_id, receiver_id, content } = req.body;

    try {
        const newMessage = await messagesService.sendMessage({ sender_id, receiver_id, content, timestamp: new Date() });
        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
};

exports.getMessage = async (req, res, next) => {
    const { id } = req.params;

    try {
        const message = await messagesService.getMessage(id);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
};

exports.deleteMessage = async (req, res, next) => {
    const { id } = req.params;

    try {
        await messagesService.deleteMessage(id);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        next(error);
    }
};
