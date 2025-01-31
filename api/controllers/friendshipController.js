const friendsService = require("../services/friendshipService");

exports.getAllfriends= async (req, res, next) =>
{
    res.status(200).json(friends);
}

exports.createFriends = async (req, res, next) =>
{
    let {id, status, friend_id, user_id} = req.body;


    try
    {
        const newFriend =
        {
            id:id, 
            status:status, 
            friend_id:friend_id, 
            user_id:user_id
        }
        newFriend = await friendService.createFriends(newfriend);
        res.status(201).json(newFriend);
    }
    catch(error)
    {
        next(error);
    }
}

exports.getFriend = (req, res, next) =>
{
    const {index} = req.params;

    const friend = friends[index];

    try
    {
        if(!friend)
        {
            const error = new Error("Friend not found!");
    
            error.status = 404;
    
            throw error;
        }

        res.status(200).json(friend);
    }
    catch(error)
    {
        next(error);
    }
} 