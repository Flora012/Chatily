
const db = require("../db/dbContext");

class MessagesRepository {
    constructor(db) {
        this.Messages = db.Messages;
        this.User = db.User;
    }


    async createMessage(senderId, receiverId, content) {
        return await this.Messages.create({
            sender_id: senderId,
            receiver_id: receiverId,
            content: content,
        });
    }

    async getMessagesBetweenUsers(userId1, userId2) {
        return await this.Messages.findAll({
            include: [
                { model: this.User, as: "sender" },
                { model: this.User, as: "receiver" },
            ],
            where: {
                [db.Sequelize.Op.or]: [
                    { sender_id: userId1, receiver_id: userId2 },
                    { sender_id: userId2, receiver_id: userId1 },
                ],
            },
            order: [["createdAt", "DESC"]],
        });
    }
    
    async getLastMessageBetweenUsers(userId1, userId2) {
        return await this.Messages.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { sender_id: userId1, receiver_id: userId2 },
                    { sender_id: userId2, receiver_id: userId1 },
                ],
            },
            order: [['createdAt', 'DESC']], 
            limit: 1, 
        });
    }
}

module.exports = new MessagesRepository(db);
