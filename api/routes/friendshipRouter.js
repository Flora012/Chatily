
const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendshipController');
const notificationsController = require("../controllers/notifyController");





router.post('/nicknames', friendshipController.createOrUpdateNickname);


router.get('/nickname/:senderId/:receiverId', friendshipController.findNicknameBySenderAndReceiver);


router.post('/messages', friendshipController.createMessage);
router.get('/messages/:friendId/:userId', friendshipController.getMessages);
router.get('/:userId', friendshipController.getFriends);
router.get('/lastMessage/:friendId/:loggedInUserId', friendshipController.getLastMessage);
router.get('/friendRequests/:userId', friendshipController.getFormattedNotifications);
router.get('/checkIfFriends/:userId1/:userId2', friendshipController.checkIfFriends);
router.get('/groups/:userId', friendshipController.getGroups);
router.post('/', friendshipController.createFriendRequest);
router.get('/friends/:userId', friendshipController.getFriendsWithProfilePicture);
router.delete('/:friendId/:userId', friendshipController.deleteFriendship);



module.exports = router;
