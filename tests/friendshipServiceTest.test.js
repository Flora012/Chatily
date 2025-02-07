require("dotenv").config();

const userRepository = require("../api/repositories/userRepository")

jest.mock("../api/db/dbContext", () => require("../__mocks__/db"));

describe("User", () => {
    beforeAll(async () => {
        await require("../__mocks__/db").sequelize.sync({ force: true });
    });

    describe("UserRepo uj felhasznalo",()=>{

        beforeAll( async () => 
            {
                const newUser =
                {
                    id: 1,
                    name:"Nemtudom",
                    passwordHash: "ugsvcuq939o12b",
                    email: "nemtudom@gmail.com"

                };

    
                await userRepository.createUser(newUser);
            });
    
            test("GetAllUsers returns length 1", async () => 
            {
                const users = await userRepository.getUsers();
                console.log(JSON.stringify(users, null, 2));
                expect((await userRepository.getUsers()).length).toBe(1);
            });


    })
});
