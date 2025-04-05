const friendshipService = require("../services/friendshipService");
const userRepository = require("../repositories/userRepository");
const { Friendships, User, Notification, Messages, Nickname } = require("../db/dbContext");
const FriendshipRepository = require("../repositories/friendshipRepository");
const friendshipRepository = new FriendshipRepository(Friendships, User, Messages, Nickname);  
const MessagesService = require("../services/messagesService");



exports.createMessage = async (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
    try {
        const newMessage = await MessagesService.createMessage(
            sender_id,
            receiver_id,
            content
        );
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Hiba az üzenet létrehozásakor a controllerben:", error);
        res.status(500).json({ error: "Hiba az üzenet létrehozásakor" });
    }
};

exports.checkIfFriends = async (req, res) => {
    const { userId1, userId2 } = req.params;
    
    try {
        const areFriends = await friendshipService.areFriends(userId1, userId2);
        res.json({ areFriends });
    } catch (error) {
        console.error('Error checking if users are friends:', error);
        res.status(500).json({ error: 'Error checking if users are friends' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { friendId, userId } = req.params;
        const messages = await friendshipService.getMessages(friendId, userId);
        res.json(messages);
    } catch (error) {
        console.error('Hiba az üzenetek lekérésekor:', error);
        res.status(500).json({ error: 'Hiba az üzenetek lekérésekor' });
    }
}

exports.createFriendRequest = async (req, res) => {
    
    const { id, email, loggedInUser } = req.body;
    
    console.log(req.body)
    try {
        if (!id || !email || !loggedInUser) {
            throw new Error("Hiányzó adatok a barátjelöléshez.");
        }

        const friend = await userRepository.getUserByEmail(loggedInUser);
        
        if (!friend) {
            throw new Error("A megadott barát nem található.");
        }

        const existingRequest = await friendshipRepository.getPendingRequests(id, friend.id);
        
        if (existingRequest.length > 0) {
            throw new Error("Már küldtél barátjelölést ennek a személynek.");
        }

        
        const friendship = await Friendships.create({
            receiver_id: id,
            sender_id: friend.id,
            status: "pending"
        });
        
        const sender = await User.findByPk(id);
        
        
        await Notification.create({
            sender_id: friend.id,
            receiver_id: id,
            type: "friend_request",
            message: `${friend.firstname} ${friend.lastname} bejelölt ismerősnek.`
        });
        

        res.json({ message: "Barátjelölés elküldve!", friendship });
    } catch (error) {
        console.error("❌ Hiba a barátjelölés létrehozásakor:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.getFriendsWithProfilePicture = async (req, res) => {
    try {
        const userId = req.params.userId;
        const friends = await friendshipService.getFriendsWithProfilePicture(userId);
        res.json(friends);
    } catch (error) {
        console.error("❌ Hiba a barátok lekérésekor:", error);
        res.status(500).json({ error: "Hiba a barátok lekérésekor." });
    }
};


exports.deleteFriendship = async (req, res) => {
    try {
      const friendId = parseInt(req.params.friendId, 10); 
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(friendId)) {
        return res.status(400).json({ error: 'Invalid friendId' });
      }
      await friendshipService.deleteFriendship(friendId, userId);
      res.status(204).send(); 
    } catch (error) {
      console.error('Error deleting friendship:', error);
      res.status(500).json({ error: 'Failed to delete friendship' });
    }
  };
exports.getFriends = async (req, res) => {
    
    try {
        const { userId } = req.params;
        
        const friends = await friendshipService.getFriendsOk(userId);
        
        res.json(friends);
    } catch (error) {
        console.error("Hiba a barátok lekérésekor:", error);
        res.status(500).json({ error: "Hiba a barátok lekérésekor" });
    }
};

exports.getLastMessage = async (req, res) => {
    const { friendId, loggedInUserId } = req.params;
    try {
        const lastMessage = await friendshipService.getLastMessage(friendId, loggedInUserId);
        res.json(lastMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}
exports.getFormattedNotifications = async (req, res) => {
    const userId = req.params.userId;
    try {
        const formattedNotifications = await friendshipService.getFormattedFriendRequests(userId);
        res.json(formattedNotifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.getGroups = async (req, res) => {
    const { userId } = req.params;
    try {
        const groups = await friendshipService.getGroups(userId);
        res.json(groups);
    } catch (error) {
        console.error("Hiba a csoportok lekérésekor:", error);
        res.status(500).json({ error: "Hiba a csoportok lekérésekor" });
    }
};

exports.createOrUpdateNickname = async (req, res) => {
    try {
        const data = req.body;
        const nickname = await friendshipService.createOrUpdateNickname(data);
        res.status(201).json(nickname);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.findNicknameBySenderAndReceiver = async (req, res) => {
    try {
        const senderId = req.params.senderId;
        const receiverId = req.params.receiverId;
        
        const nickname = await friendshipService.findNicknameBySenderAndReceiver(senderId, receiverId);
        
        
        if (nickname) {
            res.status(200).json(nickname);
        } else {

            const getUserName = await userRepository.getUserById(receiverId)
            
            res.status(201).json(getUserName);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
