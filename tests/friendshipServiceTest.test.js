jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

const friendshipService = require("../api/services/friendshipService");
const friendshipRepository = require("../api/repositories/friendshipRepository");

describe("FriendshipService", () => {
    beforeAll( async () => 
        {
            await require("../__mocks__/db").sequelize.sync({ force: true });
        });
    test("should add a friend", async () => {
        const friendshipData = { user_id: 1, friend_id: 2 };
        friendshipRepository.addFriend.mockResolvedValue(friendshipData);

        const result = await friendshipService.addFriend(friendshipData);
        expect(result).toEqual(friendshipData);
        expect(friendshipRepository.addFriend).toHaveBeenCalledWith(friendshipData);
    });

    test("should get friends", async () => {
        const friends = [{ id: 2, name: "Friend" }];
        friendshipRepository.getFriends.mockResolvedValue(friends);

        const result = await friendshipService.getFriends(1);
        expect(result).toEqual(friends);
        expect(friendshipRepository.getFriends).toHaveBeenCalledWith(1);
    });
});
