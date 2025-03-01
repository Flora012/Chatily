const friendshipService = require("../services/friendshipService");
const userRepository = require("../repositories/userRepository"); // 🔴 Új: felhasználó adatbázis-kezelő

exports.getFriendRequests = async (req, res) => {
    console.log("➡ Controller meghívva!");

    try {
        const email = req.body.email; // 🔴 Most már a body-ból vesszük az emailt
        console.log("📩 Kapott email:", email);

        if (!email) {
            console.log("❌ Hiányzó email!");
            return res.status(400).json({ error: "Hiányzó email!" });
        }

        const user = await userRepository.getUserByEmail(email);
        console.log("👤 Felhasználó az adatbázisban:", user);

        if (!user) {
            console.log("❌ Felhasználó nem található!");
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        const formattedRequests = await friendshipService.getFormattedFriendRequests(user.id);
        console.log("📬 Lekért értesítések:", formattedRequests);

        res.json(formattedRequests);
    } catch (error) {
        console.error("❌ Hiba az értesítések lekérésekor:", error);
        res.status(500).json({ error: "Hiba az értesítések lekérésekor!" });
    }
};

const { sendFriendRequest } = require("../repositories/notifyRepository");

exports.createFriendRequest = async (req, res) => {
    const { param } = req.body;
    console.log(param)

    try {
        const friendship = await sendFriendRequest(userId, friendId);
        const existingRequest = await friendship.findOne({
            where: { user_id: user.userId, friend_id: user.friendId }
        });
        if (existingRequest) {
            throw new Error("Már küldtél barátjelölést ennek a személynek.");
        }
        res.json({ message: "Barátjelölés elküldve!", friendship });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

        // Ellenőrizzük, hogy már létezik-e ilyen kapcsolat
        
    
        
    
        
    
        // Létrehozzuk a barátjelölést
        const friendship = await Friendships.create({
            user_id: userId,
            friend_id: friendId,
            status: "pending"
        });
    
        // Értesítés létrehozása a bejelölt felhasználónak
        const sender = await Users.findByPk(userId);
    
        await Notification.create({
            user_id: friendId, // A bejelölt felhasználónak szól az értesítés
            message: `${sender.name} bejelölt ismerősnek.`
        });
    
        return friendship;
};

exports.getUserNotifications = async (userId) => {
    return await Notification.findAll({
        where: { user_id: userId },
        order: [["createdAt", "DESC"]],
    });
};

