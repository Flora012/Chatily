const friendshipRepository = require("../repositories/friendshipRepository");
const { User } = require("../db/dbContext");

class FriendshipService {
    async getFormattedFriendRequests(userId) {
        try {
            const requests = await friendshipRepository.getPendingRequests(userId);
            
            // Ha a `requests` üres vagy undefined, loggoljuk ki
            if (!requests || requests.length === 0) {
                console.log("⚠️ Nincsenek függőben lévő ismerős kérések.");
                return [];
            }

            // Felhasználói adatokat is lekérjük
            const formattedRequests = await Promise.all(
                requests.map(async (request) => {
                    const user = await User.findByPk(request.user_id, {
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
}

module.exports = new FriendshipService();
