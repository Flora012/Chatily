const messageRepository = require("../repositories/messageRepository");

class MessageService {
    async sendMessage(message) {
        return await messageRepository.createMessage(message);
    }

    async getMessage(id) {
        return await messageRepository.getMessage(id);
    }

    async deleteMessage(id) {
        return await messageRepository.deleteMessage(id);
    }
}

module.exports = new MessageService();
