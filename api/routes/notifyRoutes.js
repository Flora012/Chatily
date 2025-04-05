
const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notifyController");

router.get("/:userId", notificationsController.getNotifications);
router.post("/accept", notificationsController.acceptNotification);
router.post("/reject", notificationsController.rejectNotification);
router.delete("/:notificationId", notificationsController.deleteNotification);
router.get("/:friendName/:userId",notificationsController.getNotifications)

router.post('/acceptGroup', notificationsController.acceptGroupInvitation);
router.post('/rejectGroup', notificationsController.rejectGroupInvitation);
router.post('/block', notificationsController.blockFriend); 


module.exports = router;
