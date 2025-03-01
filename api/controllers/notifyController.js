
const user = require("../models/user");
const { getUserNotifications } = require("../repositories/notifyRepository");
const userRepository = require("../repositories/userRepository");

exports.getNotifications = async (req, res) => {
    const { param } = req.body;
    const user = await userRepository.getUserByEmail(param)

    try {
        const notifications = await getUserNotifications(userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Nem sikerült lekérni az értesítéseket." });
    }
};
