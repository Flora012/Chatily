const groupMembersService = require("../services/groupMembersService");

exports.getAllGroupMembers = async (req, res, next) =>
{

    const group = groupRepository.getGroup(1);

    res.status(200).json(group.GroupMembers);
}

exports.createGroupMember = async (req, res, next) =>
{
    let {id, user_id, group_id,role} = req.body;


    try
    {
        const newGroupMember =
        {
            id: id,
            user_id: user_id,
            group_id: group_id,
            role:role,
        }
        newGroupMember = await groupMembersService.createGroupMember(newGroupMember);
        res.status(201).json();
    }
    catch(error)
    {
        next(error);
    }
}

exports.getGroupMembers = (req, res, next) =>
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