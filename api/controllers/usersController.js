const usersService = require('../services/usersService');

const bcrypt = require('bcrypt'); // Importáld a bcrypt-ot a jelszó hasheléséhez

const authService = require("../services/authService");

exports.createUser = async (req, res, next) => {
    const { name, email } = req.body;

    try {
        const newUser = await usersService.createUser({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) =>
    {
        const User = await usersService.getUsers();
    
        res.status(200).json(User);
    }

exports.getUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await usersService.getUser(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.getUserPhoneNumber = async (req, res, next) => {
    const { phoneNumber } = req.params;
    const userPhoneNumber = await usersService.getUserPhoneNumber(phoneNumber);

    if (!userPhoneNumber) {
        return true;
    };
    return false;
   
};
exports.getUserForLogin= async (req,res,next)=>{

    try {
        console.log(req.body)
        const {email,password} = req.body;
        const isOkToLogin= await authService.getUserForLogin(email,password)
        console.log(password)
        
        if(isOkToLogin==1){
            res.json({data: {message:"Sikeres bejelentkezés", status:"success"}})
        }
        else if(isOkToLogin==0){
            const error = new Error("Az e-mail cím nem megfelelő.")
            throw error
        }
        else{
            const error = new Error("Nem megfelelő jelszó.")        
            throw error
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
    
}

exports.searchUsers = async (req, res, next) => {
    try {
        const { query } = req.query;
        console.log("ojjjjjjjjjjjjjjjjjjjjjv")
        if (!query || query.length < 3) {
            return res.status(400).json({ error: "A keresési lekérdezés túl rövid." });
        }
        const users = await usersService.searchUsers(query);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};


exports.getUserEmail = async (req, res, next) => {
    const { email } = req.params;
    const userEmail = await usersService.getUserEmail(email);

    if (!userEmail) {
        return true;
    };
    return false;
   
};

exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const userData = req.body;

    try {
        const updatedUser = await usersService.updateUser(id, userData);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        await usersService.deleteUser(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};
