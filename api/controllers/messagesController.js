const toyService = require("../services/messagesService");

exports.getAllMessages = async (req, res, next) =>
{

    const shop = shopRepository.getShop(1);

    res.status(200).json(shop.Toys);
}

exports.createMessage = async (req, res, next) =>
{
    let {name, price, company,shopID} = req.body;

    price = Number(price);

    try
    {
        const newMessage =
        {
            id:id,
            sender_id: sender_id,
            receiver_id:receiver_id,

        }
        newMessage = await messagesService.createMessage(newMessage);
        res.status(201).json(newMessage);
    }
    catch(error)
    {
        next(error);
    }
}

exports.getMessages = (req, res, next) =>
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