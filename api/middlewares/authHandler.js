const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: "Nincs jogosultság!" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) {
        return res.status(403).json({ message: "Érvénytelen token!" });
    }

};

module.exports = authenticateToken;
