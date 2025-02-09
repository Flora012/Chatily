const usersService = require('../services/usersService');

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
