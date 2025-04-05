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


router.post("/sendVerificationCode/:email", usersController.sendVerificationCode);

router.post("/sendForgottenPasswordEmail/:email", usersController.sendForgottenPasswordEmail);


router.post("/", usersController.getUserForLogin);
router.get("/", usersController.getAllUsers);
router.get("/loggedIn/:loggedInEmail", usersController.getUser);
router.post("/search", usersController.searchUsers);
router.get('/:userId', usersController.getUserById);
router.post('/verify', usersController.verifyEmail);     

router.get("/isBlocked/:senderId/:receiverId",usersController.isBlockedUser)
router.get('/blocked/:userId', usersController.getBlockedUsers); 
router.delete('/unblock/:userId/:blockedUserId', usersController.unblockUser); 



router.put('/changePassword', usersController.changePassword);

router.put('/deleteAccount/:userId', usersController.deleteAccount); 



router.post("/reset-password", usersController.resetPassword);



router.post('/checkEmailExists', usersController.checkEmailExists);
router.put('/updateUserEmail', usersController.updateUserEmail);
router.post('/uploadProfilePicture', upload.single('profilePicture'), usersController.uploadProfilePicture);


module.exports = router;
