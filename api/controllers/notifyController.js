const notifyService = require("../services/notifyService");
const db = require("../db/dbContext");
const FriendshipRepository = require("../repositories/friendshipRepository"); 
const friendshipRepository = new FriendshipRepository(db.Friendships, db.User, db.Messages, db.Nickname);
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const notifications = await notifyService.getUserNotifications(userId);
        res.json(notifications);
    } catch (error) {
        console.error("❌ Hiba az értesítések lekérésekor:", error);
        res.status(500).json({ error: "Hiba az értesítések lekérésekor." });
    }
};

exports.acceptGroupInvitation = async (req, res, next) => {
    const { notificationId, userId, senderId, groupId } = req.body;
    try {
        await notifyService.acceptGroupInvitation(notificationId, userId, senderId, groupId);
        res.status(200).json({ message: 'Group invitation accepted' });
    } catch (error) {
        next(error);
    }
};

exports.rejectGroupInvitation = async (req, res, next) => {
    const { notificationId, userId, senderId, groupId } = req.body;

    
    try {
        await notifyService.rejectGroupInvitation(notificationId, userId, senderId, groupId); 
        res.status(200).json({ message: 'Group invitation rejected' });
    } catch (error) {
        next(error);
    }
};
exports.acceptNotification = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        
        await friendshipRepository.acceptFriendRequest(senderId, receiverId);
        
        const sender = await db.User.findByPk(senderId);
        const receiver = await db.User.findByPk(receiverId);
        
        await db.Notification.create({
            sender_id: receiverId, 
            receiver_id: senderId, 
            type: "friend_request_accepted", 
            message: `Gratulálunk! ${receiver.firstname} ${receiver.lastname} elfogadta a barátjelölésed.`
        });

        
        await notifyService.deleteNotificationBySenderAndReceiver(senderId, receiverId,"friend_request");

        res.json({ message: "Értesítés elfogadva és barátság létrejött." });
    } catch (error) {
        console.error("❌ Hiba az értesítés elfogadásakor:", error);
        res.status(500).json({ error: "Hiba az értesítés elfogadásakor." });
    }
};

exports.rejectNotification = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        
        
        await friendshipRepository.rejectFriendRequest(senderId, receiverId);

        
        const sender = await db.User.findByPk(receiverId)
        const receiver = await db.User.findByPk(senderId)
        await db.Notification.create({
            sender_id: receiverId, 
            receiver_id: senderId, 
            type: "friend_request_rejected", 
            message: `Sajnáljuk ${sender.firstname} ${sender.lastname} elutasította a barátjelölésed.`
        });

        
        await notifyService.deleteNotificationBySenderAndReceiver(senderId, receiverId,"friend_request");

        res.json({ message: "Értesítés elutasítva és törölve." });
    } catch (error) {
        console.error("❌ Hiba az értesítés elutasításakor:", error);
        res.status(500).json({ error: "Hiba az értesítés elutasításakor." });
    }
};







exports.deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        await notifyService.deleteNotification(notificationId);
        res.json({ message: "Értesítés törölve." });
    } catch (error) {
        console.error("❌ Hiba az értesítés törlésekor:", error);
        res.status(500).json({ error: "Hiba az értesítés törlésekor." });
    }
};

exports.blockFriend = async (req, res) => {
    const { userId, friendId, message } = req.body; 

    try {
        await notifyService.blockFriend(userId, friendId, message); 
        res.status(200).send('Friend blocked successfully.');
    } catch (error) {
        console.error('Error in NotifyController.blockFriend:', error);
        res.status(500).send('Error blocking friend.');
    }
};






