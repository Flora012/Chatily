const toyService = require("../services/groupsService");

exports.getAllGroups = async (req, res, next) =>
{

    const shop = shopRepository.getShop(1);

    res.status(200).json(shop.Toys);
}

exports.createGroup = async (req, res, next) =>
{
    let {name, price, company,shopID} = req.body;

    price = Number(price);

    try
    {
        const newGroup =
        {
            id:id,
            name: name,
            description: description,
            
            
        }
        newGroup = await groupService.createGroup(newGroup);
        res.status(201).json(newGoup);
    }
    catch(error)
    {
        next(error);
    }
}

exports.getGroup = (req, res, next) =>
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