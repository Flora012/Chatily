const jwt = require("jsonwebtoken");

// Titkos kulcs (ne tárold a kódban, inkább használj környezeti változót `.env` fájlban!)
const JWT_SECRET = process.env.JWT_SECRET || "nagyonbiztonsagostitkoskod";

// Token generáló függvény
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { generateToken };
