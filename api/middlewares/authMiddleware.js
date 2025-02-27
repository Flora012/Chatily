const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Ha a modellek máshol vannak, módosítsd az elérési utat

exports.CheckToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Nincs token megadva!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId, {
            attributes: ["id", "firstname", "lastname", "email", "profilePicture"] // Csak a szükséges adatokat adjuk vissza
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        req.user = user; // Hozzáadjuk a request objektumhoz
        next();
    } catch (error) {
        return res.status(401).json({ error: "Érvénytelen token!" });
    }
};
