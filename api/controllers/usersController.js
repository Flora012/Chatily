const toyService = require("../services/usersService");

exports.getAllUsers = async (req, res, next) =>
{

    const shop = shopRepository.getShop(1);

    res.status(200).json(shop.Toys);
}

exports.createUsers = async (req, res, next) =>
{
    let {name, price, company,shopID} = req.body;

    price = Number(price);

    try
    {
        const newUser=
        {
            id:id,
            name:name
        }
        newUser = await usersService.createUsers(newUser);
        res.status(201).json(newUser);
    }
    catch(error)
    {
        next(error);
    }
}

exports.getUser = (req, res, next) =>
{
    const {index} = req.params;

    const toy = toys[index];

    try
    {
        if(!toy)
        {
            const error = new Error("Toy not found!");
    
            error.status = 404;
    
            throw error;
        }

        res.status(200).json(toy);
    }
    catch(error)
    {
        next(error);
    }
}