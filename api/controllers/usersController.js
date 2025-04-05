
const { User } = require("../models");
const usersService = require('../services/usersService');
const userService = require('../services/usersService');

const bcrypt = require('bcrypt'); 

const authService = require("../services/authService");
const userRepository = require("../repositories/userRepository");


exports.createUser = async (req, res, next) => {
    const { name, email } = req.body;

    try {
        const newUser = await usersService.createUser({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

exports.isBlockedUser= async (req,res,next)=>{
    const {senderId, receiverId } = req.params;
    try {
        const isBlocked = await userService.isBlocked(senderId, receiverId);
        
        res.json({ isBlocked });
    } catch (error) {
        console.error('Error checking blocked status in controller:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getAllUsers = async (req, res, next) =>
    {
        const User = await usersService.getUsers();

        res.status(200).json(User);
    }
    exports.getUser = async (req, res, next) => {
        const { loggedInEmail } = req.params; 
    
        try {
            const user = await userRepository.getUserByEmail(loggedInEmail); 
    
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    
            res.status(200).json(user);
        } catch (error) {
            next(error); 
        }
    };
    




exports.getUserPhoneNumber = async (req, res, next) => {
    const { phoneNumber } = req.params;
    const userPhoneNumber = await usersService.getUserPhoneNumber(phoneNumber);

    if (!userPhoneNumber) {
        return true;
    };
    return false;

};

exports.unblockUser = async (req, res, next) => {
    const { userId, blockedUserId } = req.params;
    try {
        await usersService.unblockUser(userId, blockedUserId);
        res.json({ message: 'User unblocked successfully' });
    } catch (error) {
        next(error);
    }
};


exports.getBlockedUsers = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const blockedUsers = await usersService.getBlockedUsers(userId);
        res.json(blockedUsers);
    } catch (error) {
        next(error);
    }
};
exports.getUserForLogin= async (req,res,next)=>{
    

    try {
        
        const {email,password} = req.body;
        const isOkToLogin= await authService.getUserForLogin(email,password)
        
        
        
        if(isOkToLogin.passwordValid){
            res.json({data: {message:"Sikeres bejelentkezés", status:"success",userId:isOkToLogin.userId, userEmail:email}})
        }
        else if(!isOkToLogin.passwordValid){
            const error = new Error("Az e-mail cím nem megfelelő.")
            throw error
        }
        else{
            const error = new Error("Nem megfelelő jelszó.")        
            throw error
        }

    } catch (error) {
        res.status(500).json(error.message);
    }

}

exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const email = req.body.email;
        const profilePicturePath = req.file.path;

        const result = await userService.uploadProfilePicture(email, profilePicturePath);

        
        res.json(result);
    } catch (error) {
        console.error('Error uploading profile picture in controller:', error);
        res.status(500).json({ error: 'Error uploading profile picture' });
    }
};
exports.sendVerificationCode = async (req, res) => {

    const {email} = req.params;
    const createdUser = await usersService.sendVerificationCode(email);
    
    res.status(200).json(createdUser);
}

exports.resetPassword = async (req, res) => { 
    const { emailhash, newPassword } = req.body;

    try {
        const user = await userRepository.findUserByEmailHash(emailhash);

        if (!user) {
            return res.status(404).json({ error: 'Invalid or expired link' });
        }

        if (user.passwordResetTokenExpiry < new Date()) {
            return res.status(400).json({ error: 'Link expired' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await userRepository.updateUserPassword(user.id, hashedNewPassword);
        await userRepository.clearPasswordResetToken(user.id);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Error resetting password' });
    }
};

exports.sendForgottenPasswordEmail = async (req, res) => {
    const { email } = req.params;
    const user = await usersService.getUserByEmailFull(email);

    
    
    try {
        const forgottenPasswordEmail = await usersService.forgottenPasswordEmail(email,user.emailHash);
        res.json({ message: 'Verification code sent!', forgottenPasswordEmail }); 
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ error: error.message });
    }
};



exports.checkEmailExists = async (req, res) => {
    const { email } = req.body;
    try {
        const exists = await usersService.checkEmailExists(email);
        res.json({ exists });
    } catch (error) {
        console.error("Error checking email existence:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Felhasználó nem található' });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!passwordMatch) {
            return res.sendStatus(401); 
        }

        if (oldPassword === newPassword) {
            return res.sendStatus(402);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await userRepository.updateUserPassword(userId, hashedNewPassword);
        return res.sendStatus(200); 
    } catch (error) {
        const errorMessage = error.message || 'Ismeretlen hiba történt.';
        return res.status(500).json({ error: errorMessage });
    }
};

exports.deleteAccount = async (req, res, next) => {
    const { userId } = req.params; 

    try {
        const success = await usersService.deleteAccount(userId);
        if (success) {
            res.status(200).json({ message: "Fiók sikeresen törölve" });
        } else {
            res.status(404).json({ error: "Felhasználó nem található" });
        }
    } catch (error) {
        next(error); 
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        await usersService.verifyEmail(email, code);
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error during verification:', error);
        res.status(500).json({ error: error.message }); 
    }
};



exports.updateUserEmail = async (req, res) => {
    const { email, userId } = req.body;
    try {
        const hashedEmail = await bcrypt.hash(email, 10);
        await usersService.updateUserEmail(userId, email,hashedEmail);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error updating user email:", error);
        res.status(500).json({ error: 'Database error' });
    }
};


exports.searchUsers = async (req, res, next) => {
    try {
        const { param, loggedInUser } = req.body;
        
        

        if (!param || param.length < 3) {
            return res.status(400).json({ error: "A keresési lekérdezés túl rövid." });
        }

        const users = await userRepository.searchUsers(param,loggedInUser);


        
        
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Keresési hiba:", error);
        res.status(500).json({ error: "Szerverhiba történt!" });
    }
};

exports.getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await usersService.getUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error in getUserById controller:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
};




exports.getUserEmail = async (req, res, next) => {
    const { email } = req.params;
    const userEmail = await usersService.getUserEmail(email);

    if (!userEmail) {
        return true;
    };
    return false;

};

exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const userData = req.body;

    try {
        const updatedUser = await usersService.updateUser(id, userData);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        await usersService.deleteUser(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};
