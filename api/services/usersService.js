
const userRepository = require('../repositories/userRepository');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config();

class UserService {
    async uploadProfilePicture(email, profilePicturePath) {
        try {
            const user = await userRepository.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }

            user.profilePicture = profilePicturePath;
            await user.save();

            return { profilePicture: user.profilePicture };
        } catch (error) {
            console.error('Error uploading profile picture in service:', error);
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            return await userRepository.getUserByEmail(email);
        } catch (error) {
            console.error('Error getting user by email in service:', error);
            throw error;
        }
    }
    async getUserByEmailFull(email) {
        try {
            return await userRepository.getUserByEmailFull(email);
        } catch (error) {
            console.error('Error getting user by email in service:', error);
            throw error;
        }
    }


    

    async isBlocked(senderId, receiverId) {
        try {
            return await userRepository.isBlocked(senderId, receiverId);
        } catch (error) {
            console.error('Error checking blocked status in service:', error);
            throw error; 
        }
    }


    async checkEmailExists(email) {
        try {
            const user = await userRepository.getUserByEmail(email);
            return user !== null;
        } catch (error) {
            console.error('Error checking email existence in service:', error);
            throw error;
        }
    }

    async  sendVerificationEmail(email, code) {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, 
            },
        });
        
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email megerősítés',
            text: `A megerősítő kódod: ${code}`,
            html: `<p>A megerősítő kódod: <b>${code}</b></p>`,
        };
    
        await transporter.sendMail(mailOptions);
    }
    
    async  verifyEmail(email, code) {
        const user = await userRepository.findUserByVerificationCode(email, code);
        if (!user) {
            throw new Error('Invalid verification code');
        }
        await userRepository.updateUserVerificationStatus(user.id, true, null); 
    }
    

    async  sendVerificationCode(email) {
        const verificationCode = await this.generateVerificationCode(); 
        await this.sendVerificationEmail(email, verificationCode);
        return verificationCode;
    }

    async  forgottenPasswordEmail(email,emailhash) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, 
            },
        });
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);
        await userRepository.updatePasswordResetExpiry(email, expiryTime);

    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Elfelejtett jelszó',
            text: `Elfelejtett jelszó visszaállítása`,
            html: `<p>A jelszavadat az alábbi linkre kattintva tudod visszaállítani (24 órán belül érvényes): 
                <a href="http://localhost:5173/forgotten-password/${emailhash}">Jelszó visszaállítása</a></p>`,
        };        
    
        await transporter.sendMail(mailOptions);
    }
    

    
    
    async generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async deleteAccount(userId) {
        try {
            return await userRepository.deleteAccount(userId);
        } catch (error) {
            console.error('Error deleting account in service:', error);
            throw error;
        }
    }
    
    async updateUserEmail(userId, newEmail,hashedEmail) {
        try {
            await userRepository.updateUserEmail(userId, newEmail,hashedEmail);
        } catch (error) {
            console.error('Error updating user email in service:', error);
            throw error;
        }
    }

    async unblockUser(userId, blockedUserId) {
        try {
            await userRepository.unblockUser(userId, blockedUserId);
        } catch (error) {
            console.error('Error unblocking user:', error);
            throw error;
        }
    }
    async getBlockedUsers(userId) {
        return await userRepository.getBlockedUsers(userId);
    }
    async createUser(user) {
        return await userRepository.createUser(user);
    }

    async getUser(id) {
        return await userRepository.getUser(id);
    }

    async updateUser(id, user) {
        return await userRepository.updateUser(id, user);
    }

    async deleteUser(id) {
        return await userRepository.deleteUser(id);
    }

    async getUsers(){
        return await userRepository.getUsers();
    }

    async getUserByEmail(email) {
        return await userRepository.getUserByEmail(email);
    }

    async getUserById(userId) {
        try {
            return await userRepository.getUserByIdForMessages(userId);
        } catch (error) {
            console.error('Error in getUserById service:', error);
            throw error;
        }
    }

    
}

module.exports = new UserService();
