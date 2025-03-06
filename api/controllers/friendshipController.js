const friendshipService = require("../services/friendshipService");
const userRepository = require("../repositories/userRepository");
const friendshipRepository = require("../repositories/friendshipRepository");
const { sendFriendRequest } = require("../repositories/notifyRepository");
const { Friendships, User, Notification } = require("../db/dbContext");

exports.getFriendRequests = async (req, res) => {
    console.log("➡ Controller meghívva!");

    try {
        const { email } = req.body;
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

exports.createFriendRequest = async (req, res) => {
    console.log("➡ Barátjelölés létrehozása");
    const { id, email, friend_Email } = req.body;

    try {
        if (!id || !email || !friend_Email) {
            throw new Error("Hiányzó adatok a barátjelöléshez.");
        }

        const friend = await userRepository.getUserByEmail(friend_Email);
        if (!friend) {
            throw new Error("A megadott barát nem található.");
        }

        const existingRequest = await friendshipRepository.getPendingRequests(id, friend.id);
        if (existingRequest.length > 0) {
            throw new Error("Már küldtél barátjelölést ennek a személynek.");
        }

        // Létrehozzuk a barátjelölést
        const friendship = await Friendships.create({
            user_id: id,
            friend_id: friend.id,
            status: "pending"
        });

        // Értesítés létrehozása a bejelölt felhasználónak
        const sender = await Users.findByPk(id);
        await Notification.create({
            user_id: friend.id,
            message: `${sender.name} bejelölt ismerősnek.`
        });

        res.json({ message: "Barátjelölés elküldve!", friendship });
    } catch (error) {
        console.error("❌ Hiba a barátjelölés létrehozásakor:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Hiányzó userId paraméter." });
        }

        const notifications = await Notification.findAll({
            where: { user_id: userId },
            order: [["createdAt", "DESC"]],
        });

        res.json(notifications);
    } catch (error) {
        console.error("❌ Hiba az értesítések lekérésekor:", error);
        res.status(500).json({ error: "Hiba az értesítések lekérésekor!" });
    }
};
