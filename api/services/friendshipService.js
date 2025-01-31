const friendshipRepository = require("../repositories/friendshipRepository");

class FriendshipService {
    async addFriend(friendship) {
        return await friendshipRepository.addFriend(friendship);
    }

    async getFriends(userId) {
        return await friendshipRepository.getFriends(userId);
    }

    async removeFriend(friendshipId) {
        return await friendshipRepository.removeFriend(friendshipId);
    }
}

module.exports = new FriendshipService();
