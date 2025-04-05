
const db = require("../db/dbContext");
const { Op } = require("sequelize"); 
const {Blocks } = require('../db/dbContext');

class UserRepository {
    constructor(db) {
        this.Users = db.User;
        this.Friendships = db.Friendships;
    }

    async getBlockedUsers(userId) {
        try {
            const blocked = await this.Users.findAll({
                where: {
                    id: {
                        [Op.in]: (await Blocks.findAll({
                            where: { sender_id: userId },
                            attributes: ['receiver_id'],
                            raw: true,
                        })).map(block => block.receiver_id),
                    },
                },
                attributes: ['id', 'firstname', 'lastname', 'email', 'profilePicture'], 
            });
            return blocked;
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            throw error;
        }
    }

    async isBlocked(senderId, receiverId) {
        try {
            
            
            
            const isBlocked = await Blocks.findOne({
                where: { sender_id: receiverId, receiver_id: senderId }
            });
            
            return !!isBlocked; 
        } catch (error) {
            console.error('Error checking blocked status in repository:', error);
            throw error; 
        }
    }

    async unblockUser(userId, blockedUserId) {
        try {
            await Blocks.destroy({
                where: {
                    [Op.or]: [
                        { sender_id: userId, receiver_id: blockedUserId },
                        { sender_id: blockedUserId, receiver_id: userId },
                    ],
                },
            });
            
        } catch (error) {
            console.error('Error unblocking user in repository:', error);
            throw error;
        }
    }
    

    async createUser(user) {
        
        const existingUser = await this.Users.findOne({ where: { email: user.email } });
        if (existingUser) {
            throw new Error('Már létezik ilyen e-mail címmel felhasználó!');
        }

        
        const newUser = await this.Users.create({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            passwordHash: user.passwordHash, 
        });

        return newUser;
    }
    async searchUsers(param, loggedInEmail) {
        const user = await this.getUserByEmail(loggedInEmail); 
        
        if (!user) {
            
            console.error("User not found for email:", loggedInEmail);
            return []; 
        }
        const userId = user.id; 
        
        
        const friends = await this.getFriends(userId);
        
        return await this.Users.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { firstname: { [Op.like]: `%${param}%` } },
                            { lastname: { [Op.like]: `%${param}%` } },
                        ],
                    },
                    { id: { [Op.notIn]: friends } }, 
                    { id: { [Op.ne]: userId } },     
                ],
            },
        });

    }




    async getFriends(userId) {
        const user = await this.Users.findByPk(userId, {
            include: [
                {
                    model: this.Friendships,
                    as: 'friendshipsReceiver',
                    where: { status: { [Op.in]: ['accepted', 'blocked'] } }, 
                    required: false, 
                    include: [{
                        model: this.Users,
                        as: 'sender',
                        attributes: ['id'],
                    }]
                },
                {

                    model: this.Friendships,
                    as: 'friendshipsSender',
                    where: { status: { [Op.in]: ['accepted', 'blocked'] } }, 
                    required: false, 
                    include: [{
                        model: this.Users,
                        as: 'receiver',
                        attributes: ['id'],
                    }]
                }
            ]
        });

        if (!user) {
            return [];
        }

        const friends = new Set();

        user.friendshipsReceiver.forEach(friendship => {
            friends.add(friendship.sender.id);
        });

        user.friendshipsSender.forEach(friendship => {
            friends.add(friendship.receiver.id);
        });

        return Array.from(friends);
    }

    async updateUserEmail(userId, newEmail,hashedEmail) {
        try {
            
            const [rowsUpdated] = await this.Users.update({ email: newEmail , emailHash: hashedEmail}, { where: { id: userId } });
            if (rowsUpdated === 0) {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error updating user email in repository:', error);
            throw error;
        }
    }

    async updateUserPassword(userId, newHashedPassword) {
        try {
          const [rowsUpdated] = await this.Users.update({ passwordHash: newHashedPassword }, { where: { id: userId } });
          
          if (rowsUpdated === 0) {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error updating user password in repository:', error);
          throw error;
        }
      }

      

    async deleteAccount(userId) {
        try {
            const user = await this.Users.findByPk(userId);
            if (!user) throw new Error('Felhasználó nem található');

            
            await this.anonymizeUserInGroups(userId);

            
            await this.deleteAdminGroups(userId);

            
            const [rowsUpdated] = await this.Users.update({
                firstname: 'Ismeretlen',
                lastname: '',
                phoneNumber: null,
                email: null,
                profilePicture: null,
                emailHash: null,
                passwordHash: null,
            }, {
                where: { id: userId }
            });

            if (rowsUpdated === 0) {
                throw new Error('Felhasználó nem található');
            }
            return true;
        } catch (error) {
            console.error('Error deleting account in repository:', error);
            throw error;
        }
    }

    async anonymizeUserInGroups(userId) {
        
        const groups = await this.getGroupMemberships(userId, false); 

        await Promise.all(groups.map(async (group) => {
            await this.anonymizeUserInGroup(userId, group.id);
        }));
    }

    async deleteAdminGroups(userId) {
        
        const groups = await this.getGroupMemberships(userId, true); 

        await Promise.all(groups.map(async (group) => {
            await this.deleteGroup(group.id);
        }));
    }

    async getGroupMemberships(userId, isAdmin) {
        
        return await this.Users.findAll({
            where: { id: userId },
            include: [{
                model: this.Groups, 
                through: {
                    where: { role: isAdmin ? 'admin' : { [Op.ne]: 'admin' } } 
                },
                attributes: ['id']
            }]
        });
    }

    async anonymizeUserInGroup(userId, groupId) {
        
        await this.GroupMembers.update({
            firstname: 'Ismeretlen',
            lastname: ''
        }, {
            where: {
                user_id: userId,
                group_id: groupId
            }
        });
    }

    async  findUserByVerificationCode(email, code) {
        return await User.findOne({ where: { email, verificationCode: code } });
    }
    
    async  updateUserVerificationStatus(userId, verified, verificationCode) {
        await User.update({ verified, verificationCode }, { where: { id: userId } });
    }

    async deleteGroup(groupId) {
        
        await this.Groups.destroy({ where: { id: groupId } });
        
    }




    async getUserByEmail(email) {
        try {
            return await this.Users.findOne({
                where: { email },
                attributes: ['id', 'firstname', 'lastname', 'email', 'profilePicture'],
            });
        } catch (error) {
            console.error('Error getting user by email in repository:', error);
            throw error;
        }
    }
    async updatePasswordResetExpiry(email, expiryTime) {
        try {
            
            const [affectedRows, updatedUsers] = await this.Users.update(
                { passwordResetTokenExpiry: expiryTime },
                { where: { email: email }, returning: true } 
            );
            
            if (affectedRows === 0) {
                
                return null;
            }
    
            
            return updatedUsers[0]; 
        } catch (error) {
            console.error('Error updating password reset expiry:', error);
            throw error;
        }
    }
    
    

    async findUserByEmailHash(emailhash) {
        return await this.Users.findOne({ where: { emailHash: emailhash } });
    }
    
    async updateUserPassword(userId, newPasswordHash) {
        return await this.Users.update({ passwordHash: newPasswordHash }, { where: { id: userId } });
    }
    
    async clearPasswordResetToken(userId) {
        return await this.Users.update({ emailHash: null, passwordResetTokenExpiry: null }, { where: { id: userId } });
    }
    async getUserEmailById(userId) {
        const user = await this.Users.findOne({
            where: { id: userId },
            attributes: ['email'],
        });
        return user ? user.email : null;
    }

    async getUserByEmailFull(email) {
        return await this.Users.findOne({
            where: { email }});
    }


    
    async getUserById(UserId) {
        
        return await this.Users.findOne({ where: { id: UserId } });
    }

    async getUserByIdForMessages(userId) {
        try {
            return await this.Users.findByPk(userId, {
                attributes: ['id', 'firstname', 'lastname', 'email','profilePicture'] 
            });
        } catch (error) {
            console.error('Error in getUserById repository:', error);
            throw error;
        }
    }

    async getUsers() {
        return await this.Users.findAll();
    }

    async updateUser(id, user) {
        return await this.Users.update(user, { where: { id } });
    }

    async deleteUser(id) {
        return await this.Users.destroy({ where: { id } });
    }

    async getUserPhoneNumber(phoneNumber) {
        return await this.Users.findOne({ where: { phoneNumber } });
    }

    


}

module.exports = new UserRepository(db);
