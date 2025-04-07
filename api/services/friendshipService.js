const FriendshipRepository = require('../repositories/friendshipRepository');
const userRepository = require('../repositories/userRepository')
const { Friendships, User, Messages, GroupMembers, Groups, Nickname } = require('../db/dbContext')
const friendshipRepository = new FriendshipRepository(Friendships, User, Messages, Nickname)
const messagesRepository = require("../repositories/messagesRepository")

class FriendshipService {

    async getFormattedFriendRequests(userId) {
        try {
            const requests = await friendshipRepository.getPendingRequests(userId);

            if (!requests || requests.length === 0) {

                return [];
            }

            const formattedRequests = await Promise.all(
                requests.map(async (request) => {
                    const user = await User.findByPk(request.receiver_id, {
                        attributes: ["id", "firstname", "lastname"],
                    });

                    return {
                        id: request.id,
                        senderName: user ? `${user.firstname} ${user.lastname}` : "Ismeretlen felhasználó",
                    };
                })
            );

            return formattedRequests;
        } catch (error) {
            console.error("🔥 Hiba a kérések formázásánál:", error);
            throw new Error("Nem sikerült lekérni az ismerős kéréseket.");
        }
    }

    async getNickname(senderId, receiverId) {
        try {
            const nickname = await this.findNicknameBySenderAndReceiver(senderId, receiverId);
            return nickname ? nickname.nickname : null;
        } catch (error) {
            console.error('Error getting nickname:', error);
            return null;
        }
    }

    async areFriends(userId1, userId2) {
        return await friendshipRepository.areFriends(userId1, userId2);
    }

    async getMessages(friendId, userId) {
        try {
            return await friendshipRepository.findMessagesBetweenUsers(userId, friendId);
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    }

    async createMessage(sender_id, receiver_id, content) {
        try {

            const newMessage = await messagesRepository.createMessage(
                sender_id,
                receiver_id,
                content
            );
            return newMessage;
        } catch (error) {
            console.error("Hiba az üzenet létrehozásakor a serviceben:", error);
            throw error;
        }
    };

    async getFriendsOk(userId) {

        try {
            const friendsIds = await friendshipRepository.getFriends(userId);
            const friendDetails = await Promise.all(friendsIds.map(async (friendId) => {
                const friend = await userRepository.getUserById(friendId);
                const nickname = await this.getNickname(userId, friendId);
                return {
                    ...friend,
                    nickname: nickname,
                };
            }));
            return friendDetails;
        } catch (error) {
            console.error('Error fetching friends:', error);
            throw error;
        }
    }

    async getFriendsWithProfilePicture(userId) {
        try {
            return await friendshipRepository.getFriendsWithProfilePicture(userId);
        } catch (error) {
            console.error('Error getting friends with profile picture in service:', error);
            throw error;
        }
    }

    async deleteFriendship(friendId, userId) {
        try {
            await friendshipRepository.deleteFriendship(friendId, userId);
        } catch (error) {
            console.error('Error deleting friendship in service:', error);
            throw error;
        }
    }

    async getFriends(userId) {

        try {

            const friendsIds = await friendshipRepository.getFriends(userId);

            const friendDetails = [];
            for (const friendId of friendsIds) {

                const friend = await userRepository.getUserById(friendId);

                friendDetails.push(friend);
            }


            return friendDetails;
        } catch (error) {
            console.error('Hiba a barátok lekérésekor:', error);
            throw error;
        }
    }
    async acceptFriendRequest(senderId, receiverId) {
        try {
            await friendshipRepository.acceptFriendRequest(senderId, receiverId)
        } catch (error) {
            console.error('Error accepting:', error);
            throw error;
        }
    }
    async rejectFriendRequest(senderId, receiverId) {
        try {
            await friendshipRepository.rejectFriendRequest(senderId, receiverId)
        } catch (error) {
            console.error('Error rejecting:', error);
            throw error;
        }
    }

    async getLastMessage(friendId, loggedInUserId) {
        try {
            const message = await messagesRepository.getLastMessageBetweenUsers(friendId, loggedInUserId);
            return message;
        } catch (error) {
            console.error('Error getting the last message:', error);
            throw error;
        }
    }
    async getGroups(userId) {
        try {
            const groupMemberships = await GroupMembers.findAll({
                where: { user_id: userId },
                include: [{ model: Groups, as: 'group' }],
            });

            const groups = groupMemberships.map((membership) => membership.group);
            return groups;
        } catch (error) {
            console.error('Hiba a csoportok lekérésekor:', error);
            throw error;
        }
    }
    async getUserById(userId) {
        try {

            return await userRepository.getUserById(userId);
        } catch (error) {
            console.error('Hiba a felhasználó lekérésekor:', error);
            throw error;
        }
    }

    async createOrUpdateNickname(data) {
        return await friendshipRepository.createOrUpdateNickname(data);
    }

    async findNicknameBySenderAndReceiver(senderId, receiverId) {
        return await friendshipRepository.findNicknameBySenderAndReceiver(senderId, receiverId);
    }
}

module.exports = new FriendshipService();
