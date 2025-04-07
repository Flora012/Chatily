
const express = require('express');
const groupMembersController = require('../controllers/groupMembersController');

const router = express.Router();
router.delete('/delete/:groupId/:userId', groupMembersController.deleteGroupMember);
router.put('/makeToModerator/:userId/:groupId', groupMembersController.makeModerator);
router.put('/removeModerator/:userId/:groupId', groupMembersController.removeModerator); 
router.post('/notify', groupMembersController.notifyGroupMember); 
router.get('/role/:userId/:groupId', groupMembersController.getGroupMemberRole); 
router.get('/:groupId', groupMembersController.getGroupMembers);
router.put('/updateNickname/:groupId/:userId', groupMembersController.updateNickname); 
router.get('/groups/:userId', groupMembersController.getGroups);
router.get('/isAdmin/:groupId/:userId', groupMembersController.checkIfAdmin);







//router.get('/users', groupMembersController.getUsers);
//router.post('/', groupMembersController.createGroupMember);




module.exports = router;
