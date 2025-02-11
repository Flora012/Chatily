const bcrypt = require('bcrypt'); // Importáld a bcrypt-ot a jelszó hasheléséhez
const User = require("../models/user"); // Ha a fájl nem létezik, készíts egy modellt a felhasználókhoz
const userRepository = require("../repositories/userRepository");
const authService = require("../services/authService");
const { generateToken } = require("../utils/jwtUtils");

exports.getUsers = async (req, res, next) => {
    res.status(200).send(await authService.getUsers());
};

exports.createUser = async (req, res, next) => {
    try {
        const { email, firstname, lastname, phoneNumber, password } = req.body;

        // Ellenőrizzük, hogy az e-mail vagy telefonszám már létezik-e
        const existingUser = await userRepository.getUserEmail(email);
        const existingUserTelefonszam = await userRepository.getUserPhoneNumber(phoneNumber);

        if (existingUser || existingUserTelefonszam) {
            console.log("qehbwjlnéwb")
            return res.status(400).json({ error: "Ez az e-mail cím vagy telefonszám már használatban van!" });
        }

        // Jelszó validálás
        const passwordValidation = isPasswordValid(password);
        if (!passwordValidation.isValid) {
            console.log(passwordValidation.message); // Ha szükséges, debug információ
            return res.status(400).json({ error: passwordValidation.message });
        }

        // Jelszó hash-elése
        const hashedPassword = await bcrypt.hash(password, 10); // 10 a saltRounds érték

        // Új felhasználó létrehozása a hashelt jelszóval
        const newUser = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            phoneNumber: phoneNumber,
            passwordHash: hashedPassword, 
        };

        await authService.createUser(newUser);

        // Token generálása
        const token = generateToken(newUser._id); 
        console.log(token);

        res.json({ data: { message: "Sikeres regisztráció!", status: 'success', userid: newUser._id, token } });
    } catch (error) {
        console.error("Regisztrációs hiba:", error);
        res.status(500).json({ error: "Szerverhiba történt!" });
    }
};


