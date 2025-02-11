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
        
        const token = generateToken(newUser._id); 

        console.log(token);

        res.json({ data: { message: "Sikeres regisztráció!", status: 'success', userid: newUser._id, token } });
    } catch (error) {
        console.error("Regisztrációs hiba:", error);
        res.status(500).json({ error: "Szerverhiba történt!" });
    }
};


exports.getUserForLogin= async (req,res,next)=>{

    try {
        const {email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 1);
        const{userEmail,userPasswordHash}= await authService.getUserForLogin(email)
        console.log(passwordHash)
        console.log(userPasswordHash)
        if(email==userEmail && hashedPassword==userPasswordHash){
            res.json({data: {message:"Sikeres bejelentkezés", status:"success"}})
        }

    } catch (error) {
        const {email,password} = req.body;
        console.log(email)
        console.log(password)
        res.status(500).json({ error: "Ezzel a jelszóval és e-maillel nincs regisztrált felhasználó." });
    }
    
}


