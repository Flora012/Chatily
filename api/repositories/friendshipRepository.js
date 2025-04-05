
const { Op } = require("sequelize"); 

const {Blocks } = require('../db/dbContext');

class FriendshipRepository {
    constructor(Friendships, User, Messages, Nickname) {
        this.Friendships = Friendships;
        this.User = User;
        this.Messages = Messages;
        this.Nickname = Nickname; 
    }
    async getPendingRequests(userId, friendId) {
        return await this.Friendships.findAll({
            where: {
                [Op.or]: [
                    { receiver_id: userId, sender_id: friendId }, 
                    { receiver_id: friendId, sender_id: userId } 
                ],
                status: 'pending'
            }
        });
    }
    async areFriends(userId1, userId2) {
        const friendship = await this.Friendships.findOne({
            where: {
                [Op.or]: [
                    { sender_id: userId1, receiver_id: userId2, status: 'accepted' },
                    { sender_id: userId2, receiver_id: userId1, status: 'accepted' },
                ],
            },
        });
        return !!friendship; 
    }
    async acceptFriendRequest(senderId, receiverId) {
        try {
            const friendRequest = await this.Friendships.findOne({
                where: { receiver_id: receiverId, sender_id: senderId, status: 'pending' } 
            });

            if (!friendRequest) {
                throw new Error('Nem található függőben lévő barátjelölés!');
            }
            
            await this.Friendships.update(
                { status: 'accepted' },
                {
                    where: {
                        [Op.or]: [
                            { receiver_id: receiverId, sender_id: senderId },
                            { receiver_id: senderId, sender_id: receiverId }
                        ]
                    }
                }
            );
            await this.Friendships.destroy({
                where: { receiver_id: senderId, sender_id: receiverId }
            });
        } catch (error) {
            console.error('Hiba a barátjelölés elfogadásakor:', error);
            throw error;
        }
    }

    async findMessagesBetweenUsers(userId, friendId) {
        try {
            const loggedInUser = await this.User.findOne({ where: { id: userId } });
            const otherUser = await this.User.findOne({
                where: {
                    id: friendId,
                },
            });
            if (!otherUser) {
                throw new Error('User not found');
            }
            if (!loggedInUser) {
                throw new Error('Logged-in user not found');
            }
            return await this.Messages.findAll({
                where: {
                    [Op.or]: [
                        { sender_id: loggedInUser.id, receiver_id: otherUser.id },
                        { sender_id: otherUser.id, receiver_id: loggedInUser.id },
                    ],
                },
                order: [['createdAt', 'ASC']],
                raw: true,
            });
        } catch (error) {
            console.error('Error finding messages between users:', error);
            throw error;
        }
    }
    async rejectFriendRequest(senderId, receiverId) {
        try {
            const friendRequest = await this.Friendships.findOne({
                where: { receiver_id: receiverId, sender_id: senderId, status: 'pending' }
            });
            if (!friendRequest) {
                throw new Error('Nem található függőben lévő barátjelölés!');
            }
            await friendRequest.destroy();
        } catch (error) {
            console.error('Hiba a barátjelölés elutasításakor:', error);
            throw error;
        }
    }
    async getFriends(userId) {
        const user = await this.User.findByPk(userId, {
            include: [
                {
                    model: this.Friendships,
                    as: 'friendshipsReceiver',
                    where: { status: 'accepted' },
                    required: false, 
                    include: [{
                        model: this.User,
                        as: 'sender',
                        attributes: ['id', 'firstname', 'lastname'],
                    }]
                },
                {
                    model: this.Friendships,
                    as: 'friendshipsSender',
                    where: { status: 'accepted' },
                    required: false, 
                    include: [{
                        model: this.User,
                        as: 'receiver',
                        attributes: ['id', 'firstname', 'lastname'],
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
    
    async createOrUpdateNickname(data) {
        const existingNickname = await this.Nickname.findOne({
            where: {
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
            },
        });

        if (existingNickname) {
            existingNickname.nickname = data.nickname;
            await existingNickname.save();
            return existingNickname;
        } else {
            return await this.Nickname.create(data);
        }
    }

    async findNicknameBySenderAndReceiver(senderId, receiverId) {
        return await this.Nickname.findOne({
            where: {
                sender_id: senderId,
                receiver_id: receiverId,
            },
        });
    }

    async deleteFriendship(userId, friendId) { 
        try {
          
          const friendshipToDelete = await this.Friendships.findOne({
            where: {
              [Op.and]: [
                {
                  [Op.or]: [{ sender_id: userId, receiver_id: friendId }, { sender_id: friendId, receiver_id: userId }],
                },
                { status: 'accepted' },
              ],
            },
          });
      
          if (!friendshipToDelete) {
            throw new Error('Friendship not found'); 
          }
      
          
          await this.Messages.destroy({
            where: {
              [Op.or]: [
                { sender_id: userId, receiver_id: friendId },
                { sender_id: friendId, receiver_id: userId },
              ],
            },
          });
      
          
          await friendshipToDelete.destroy();
        } catch (error) {
          console.error('Error deleting friendship in repository:', error);
          throw error;
        }
      }
      
      

      async getFriendsWithProfilePicture(userId) {
        try {
            
            const blockedUserIds = await Blocks.findAll({
                where: { sender_id: userId },
                attributes: ['receiver_id']
            }).then(result => result.map(item => item.receiver_id));


            const user = await this.User.findByPk(userId, {
                include: [
                    {
                        model: this.Friendships,
                        as: 'friendshipsReceiver',
                        where: { status: 'accepted' },
                        required: false,
                        include: [{
                            model: this.User,
                            as: 'sender',
                            attributes: ['id', 'firstname', 'lastname', 'profilePicture'],
                            where: {
                                id: {
                                    [Op.notIn]: blockedUserIds 
                                }
                            }
                        }]
                    },
                    {
                        model: this.Friendships,
                        as: 'friendshipsSender',
                        where: { status: 'accepted' },
                        required: false,
                        include: [{
                            model: this.User,
                            as: 'receiver',
                            attributes: ['id', 'firstname', 'lastname', 'profilePicture'],
                            where: {
                                id: {
                                    [Op.notIn]: blockedUserIds 
                                }
                            }
                        }]
                    }
                ]
            });

            if (!user) {
                return [];
            }

            const friends = new Set();

            user.friendshipsReceiver.forEach(friendship => {
                friends.add(friendship.sender);
            });

            user.friendshipsSender.forEach(friendship => {
                friends.add(friendship.receiver);
            });

            return Array.from(friends);
        } catch (error) {
            console.error('Error getting friends with profile picture:', error);
            throw error;
        }
    }
}

module.exports = FriendshipRepository;
