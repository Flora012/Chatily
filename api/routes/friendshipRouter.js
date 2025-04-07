
const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendshipController');
const notificationsController = require("../controllers/notifyController");




router.get('/:userId', friendshipController.getFriends);
router.get('/friends/:userId', friendshipController.getFriendsWithProfilePicture);
router.get('/checkIfFriends/:userId1/:userId2', friendshipController.checkIfFriends);
router.post('/', friendshipController.createFriendRequest);
router.get('/nickname/:senderId/:receiverId', friendshipController.findNicknameBySenderAndReceiver);
router.delete('/:friendId/:userId', friendshipController.deleteFriendship);
router.get('/lastMessage/:friendId/:loggedInUserId', friendshipController.getLastMessage);
router.post('/nicknames', friendshipController.createOrUpdateNickname);
router.get('/messages/:friendId/:userId', friendshipController.getMessages);
router.post('/messages', friendshipController.createMessage);










//router.get('/friendRequests/:userId', friendshipController.getFormattedNotifications);
//router.get('/groups/:userId', friendshipController.getGroups);



module.exports = router;
