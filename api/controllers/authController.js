const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize"); 
const {User} = require("../models"); 
const userRepository = require("../repositories/userRepository");
const authService = require("../services/authService");
const usersService = require("../services/usersService");



exports.getUsers = async (req, res, next) => {
    res.status(200).send(await authService.getUsers());
};

exports.createUser = async (req, res, next) => {
    try {
        const { email, firstname, lastname, phoneNumber, password } = req.body;
        const existingUser = await userRepository.getUserByEmail(email);
        const existingUserTelefonszam = await userRepository.getUserPhoneNumber(phoneNumber);

        if (existingUser || existingUserTelefonszam) {
            return res.status(400).json({ error: "Ez az e-mail cím vagy telefonszám már használatban van!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedEmail = await bcrypt.hash(email, 10);

        const newUser = {
            firstname,
            lastname,
            email,
            phoneNumber,
            passwordHash: hashedPassword,
            emailHash: hashedEmail,
        };
        const createdUser = await usersService.createUser(newUser);
        
        

        res.json({
            data: {
                message: "Sikeres regisztráció! Ellenőrizze e-mailjét a megerősítő kódhoz.",
                status: "success",
                userid: createdUser.id
            }
        });
    } catch (error) {
        console.error("Regisztrációs hiba:", error);
        res.status(500).json({ error: "Szerverhiba történt!" });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Hibás email vagy jelszó!" });
        }

        const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Hibás email vagy jelszó!" });
        }


        res.json({
            userid: user.id,
            token,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error("Bejelentkezési hiba:", error);
        res.status(500).json({ error: "Szerverhiba történt!" });
    }
};

exports.searchUsers = async (req, res, next) => {
    try {
        const { param } = req.body;
        
        

        if (!param || param.length < 3) {
            return res.status(400).json({ error: "A keresési lekérdezés túl rövid." });
        }

        const users = await userRepository.searchUsers(param);


        
        res.status(200).json({users});
    } catch (error) {
        console.error("Keresési hiba:", error);
        res.status(500).json({ error: "Szerverhiba történt!" });
    }
};
