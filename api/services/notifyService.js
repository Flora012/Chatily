const { Friendships, User, Notification, db, Messages, Nickname } = require('../db/dbContext');
const FriendshipRepository = require("../repositories/friendshipRepository");
const NotifyRepository = require("../repositories/notifyRepository");
const groupMembersService = require("./groupMembersService");
const friendshipService = require("./friendshipService");
const groupMembersRepository = require('../repositories/groupMembersRepository');
const { Op } = require('sequelize');

const notificationRepository = new NotifyRepository(Notification, db);
const friendshipRepository = new FriendshipRepository(Friendships, User, Messages, Nickname);

class NotifyService {
    async getUserNotifications(userId) {
        try {
            return await notificationRepository.getUserNotifications(userId);
        } catch (error) {
            console.error("Hiba a felhasználó értesítéseinek lekérdezésekor a service-ben:", error);
            throw error;
        }
    }

    async deleteNotificationBySenderAndReceiver(senderId, receiverId, message) {
        try {
            await notificationRepository.deleteNotificationBySenderAndReceiver(senderId, receiverId, message);
        } catch (error) {
            console.error("Hiba az értesítés törlése közben a service-ben:", error);
            throw error;
        }
    }
    async deleteNotification(notificationId) {
        try {
            const notification = await notificationRepository.getNotificationById(notificationId);

            if (notification && notification.type === 'friend_request') {
                await notificationRepository.deleteFriendshipByNotification(notification.sender_id, notification.receiver_id);
            }


            await notificationRepository.deleteNotification(notificationId);
        } catch (error) {
            console.error("Hiba az értesítés törlése közben a service-ben:", error);
            throw error;
        }
    }

    async acceptNotification(senderId, receiverId) {
        try {

            await friendshipRepository.acceptFriendRequest(senderId, receiverId);

            const sender = await User.findByPk(senderId);
            const receiver = await User.findByPk(receiverId);

            await notificationRepository.create({
                sender_id: receiverId,
                receiver_id: senderId,
                type: "friend_request_accepted",
                message: `Gratulálunk! ${receiver.firstname} ${receiver.lastname} elfogadta a barátjelölésed.`
            });


            await this.deleteNotificationBySenderAndReceiver(senderId, receiverId, "friend_request");

        } catch (error) {
            console.error("❌ Hiba az értesítés elfogadásakor a serviceben:", error);
            throw error;
        }
    }
    async rejectNotification(senderId, receiverId) {
        try {

            await friendshipRepository.rejectFriendRequest(senderId, receiverId);


            const sender = await User.findByPk(receiverId)
            const receiver = await User.findByPk(senderId)
            await notificationRepository.create({
                sender_id: receiverId,
                receiver_id: senderId,
                type: "friend_request_rejected",
                message: `Sajnáljuk ${sender.firstname} ${sender.lastname} elutasította a barátjelölésed.`
            });


            await this.deleteNotificationBySenderAndReceiver(senderId, receiverId, "friend_request");

        } catch (error) {
            console.error("❌ Hiba az értesítés elutasításakor a serviceben:", error);
            throw error;
        }
    }

    async createNotification(data) {
        try {
            await notificationRepository.create(data);
        } catch (error) {
            console.error("❌ Hiba az értesítés létrehozásakor a serviceben:", error);
            throw error;
        }
    }
    async acceptGroupInvitation(notificationId, userId, senderId, groupId) {
        const notification = await notificationRepository.getNotificationById(notificationId);
        const user = await friendshipService.getUserById(userId);
        const sender = await friendshipService.getUserById(senderId);
        if (!notification) {
            throw new Error('Notification not found');
        }
        await groupMembersService.updateStatus(userId, groupId, 'accepted');
        await notificationRepository.deleteNotification(notificationId);
        await notificationRepository.createNotification({
            sender_id: userId,
            receiver_id: senderId,
            type: "group_invitation_accepted",
            message: `${user.firstname} ${user.lastname} elfogadta a csoport meghívást!`,
        });
    }

    async rejectGroupInvitation(notificationId, userId, senderId, groupId) {

        const notification = await notificationRepository.getNotificationById(notificationId);
        const user = await friendshipService.getUserById(userId);
        const sender = await friendshipService.getUserById(senderId);
        if (!notification) {
            throw new Error('Notification not found');
        }


        await groupMembersRepository.deleteNotificationBySenderAndReceiver(groupId, userId);

        await notificationRepository.deleteNotification(notificationId);

        await notificationRepository.createNotification({
            sender_id: userId,
            receiver_id: senderId,
            type: "group_invitation_rejected",
            message: `${user.firstname} ${user.lastname} elutasította a csoport meghívást!`,
        });
    }
    async blockFriend(userId, friendId, message) {
        try {
            const user = await User.findByPk(userId);
            const friend = await User.findByPk(friendId);
            if (!user || !friend) {
                throw new Error('User or friend not found');
            }
            await notificationRepository.blockFriend(userId, friendId);
            await notificationRepository.create({
                sender_id: userId,
                receiver_id: userId,
                type: 'friend_blocked',
                message: message,
            });
        } catch (error) {
            console.error('Error blocking friend in service:', error);
            throw error;
        }
    }
}

module.exports = new NotifyService();
