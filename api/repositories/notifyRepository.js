const { User, Notification, Friendships, GroupMembers, Blocks } = require('../db/dbContext');
const { Op } = require('sequelize');

class NotifyRepository {
    constructor(Notification, db) {
        this.Notification = Notification;
        this.db = db;
    }

    async createNotification(notification) {
        return await this.Notification.create(notification);
    }

    async getUserNotifications(userId) {
        try {
            if (!userId) {
                throw new Error("A userId nem lehet üres vagy undefined.");
            }

            return await this.Notification.findAll({
                where: { receiver_id: userId },
                attributes: ["id", "message", "createdAt", "sender_id", "receiver_id", "type", "group_id"],
                order: [["createdAt", "DESC"]],
                include: [{
                    model: User,
                    as: 'sender',
                    attributes: ["firstname", "lastname"],
                }],
                raw: true,
                nest: true,
            });
        } catch (error) {
            console.error("Error in getUserNotifications repository:", error);
            throw error;
        }
    }
    async deleteNotificationBySenderAndReceiver(senderId, receiverId, message) {
        try {
            return await this.Notification.destroy({
                where: { sender_id: senderId, receiver_id: receiverId, type: message },
            });
        } catch (error) {
            console.error("Error in deleteNotificationBySenderAndReceiver repository:", error);
            throw error;
        }
    }
    async deleteNotification(notificationId) {
        try {
            return await this.Notification.destroy({
                where: { id: notificationId },
            });
        } catch (error) {
            console.error("Error in deleteNotification repository:", error);
            throw error;
        }
    }

    async deleteFriendshipByNotification(senderId, receiverId) {
        try {
            await Friendships.destroy({
                where: {
                    [Op.or]: [
                        { sender_id: senderId, receiver_id: receiverId },
                        { sender_id: receiverId, receiver_id: senderId }
                    ]
                }
            });
        } catch (error) {
            console.error('Error deleting friendship by notification:', error);
            throw error;
        }
    }

    async deleteGroupMemberByNotification(senderId, receiverId, message) {
        try {
            await GroupMembers.destroy({
                where: {
                    [Op.or]: [
                        { sender_id: senderId, receiver_id: receiverId, type: message },
                        { sender_id: receiverId, receiver_id: senderId, type: message }
                    ]
                }
            });
        } catch (error) {
            console.error('Error deleting groupmembers by notification:', error);
            throw error;
        }
    }
    async create(data) {


        return await this.Notification.create(data);
    }
    async getNotificationById(notificationId) {
        try {
            return await this.Notification.findByPk(notificationId);
        } catch (error) {
            console.error("Error in getNotificationById repository:", error);
            throw error;
        }
    }
    async blockFriend(userId, friendId) {
        try {
            return await Blocks.create(
                {
                    sender_id: userId,
                    receiver_id: friendId,
                }
            );
        } catch (error) {
            console.error('Error blocking friend:', error);
            throw error;
        }
    }
}

module.exports = NotifyRepository;
