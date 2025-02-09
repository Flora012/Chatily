const express = require("express");
const router = express.Router();

// Regisztrációs endpoint
router.post("/registration", async (req, res) => {
  try {
    // Regisztrációs logika
    // (például validálás, felhasználó létrehozása az adatbázisban, stb.)
    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Bejelentkezési endpoint (opcionális)
router.post("/login", async (req, res) => {
  try {
    // Bejelentkezési logika
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
