const bcrypt = require('bcrypt'); // Importáld a bcrypt-ot a jelszó hasheléséhez
const User = require("../models/user"); // Ha a fájl nem létezik, készíts egy modellt a felhasználókhoz
const userRepository = require("../repositories/userRepository");
const authService = require("../services/authService");
const { query } = require('express');

exports.getUsers = async (req, res, next) => {
    res.status(200).send(await authService.getUsers());
};

exports.createUser = async (req, res, next) => {
    try {
        const { email, firstname, lastname, phoneNumber, password } = req.body;
        const existingUser = await userRepository.getUserEmail(email);
        const existingUserTelefonszam = await userRepository.getUserPhoneNumber(phoneNumber);

        if (existingUser || existingUserTelefonszam) {
            console.log("qehbwjlnéwb")
            return res.status(400).json({ error: "Ez az e-mail cím vagy telefonszám már használatban van!" });
        }
        const hashedPassword = await bcrypt.hash(password, 1); 


        const newUser = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            phoneNumber: phoneNumber,
            passwordHash: hashedPassword, 
        };
        
        await authService.createUser(newUser);
        
        

        res.json({ data: { message: "Sikeres regisztráció!", status: 'success', userid: newUser._id } });
    } catch (error) {
        console.error("Regisztrációs hiba:", error);
        res.status(500).json({ error: "Szerverhiba történt!" });
    }
};

exports.searchUsers = async (req, res, next) => {
    try {
        const { param } = req.body;
        if (!param || param.length < 3) {
            return res.status(400).json({ error: "A keresési lekérdezés túl rövid." });
        }

        // Feltételezve, hogy az authService.searchUsers egy adatbázis keresést végez
        const users = await authService.searchUsers(param);
        
        res.status(200).json({ users });  // Fontos: { users } objektumként adjuk vissza!
    } catch (error) {
        next(error);
    }
};








