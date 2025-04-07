const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const usersController = require("../controllers/usersController");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });



router.get("/loggedIn/:loggedInEmail", usersController.getUser);
router.post("/reset-password", usersController.resetPassword);
router.post('/checkEmailExists', usersController.checkEmailExists);
router.post('/checkEmailandPhoneNumberExists', usersController.checkEmailandPhoneNumberExists);
router.post("/sendForgottenPasswordEmail/:email", usersController.sendForgottenPasswordEmail);
router.post("/sendVerificationCode/:email", usersController.sendVerificationCode);
router.get("/isBlocked/:senderId/:receiverId",usersController.isBlockedUser)
router.get('/blocked/:userId', usersController.getBlockedUsers); 
router.get('/:userId', usersController.getUserById);
router.post('/uploadProfilePicture', upload.single('profilePicture'), usersController.uploadProfilePicture);
router.put('/changePassword', usersController.changePassword);
router.put('/deleteAccount/:userId', usersController.deleteAccount); 
router.delete('/unblock/:userId/:blockedUserId', usersController.unblockUser); 
router.post("/", usersController.getUserForLogin);
router.put('/updateUserEmail', usersController.updateUserEmail);








//router.post("/search", usersController.searchUsers);
//router.post('/verify', usersController.verifyEmail);     
//router.put('/updateUser', usersController.updateUser)


module.exports = router;
