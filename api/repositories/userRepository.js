class UserRepository {
    constructor(db) {
        this.Users = db.User;
    }

    async createUser(user) {
        const passwordValidation = isPasswordValid(user.password);
        if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
        }

        return await this.Users.create(user);
    }

    // A többi metódus változatlan marad
    async getUser(id) {
        return await this.Users.findOne({ where: { id } });
    }

    async getUsers() {
        return await this.Users.findAll();
    }

    async updateUser(id, user) {
        return await this.Users.update(user, { where: { id } });
    }

    async deleteUser(id) {
        return await this.Users.destroy({ where: { id } });
    }

    async getUserPhoneNumber(phoneNumber) {
        return await this.Users.findOne({ where: { phoneNumber } });
    }

    async getUserEmail(email) {
        return await this.Users.findOne({ where: { email } });
    }

    // Jelszóellenőrző függvény
    

}

function isPasswordValid(password) {
    // Ellenőrizzük, hogy a jelszó legalább 8 karakter hosszú
    const minLength = /.{8,}/;
    // Ellenőrizzük, hogy a jelszó tartalmaz-e legalább egy nagybetűt
    const hasUpperCase = /[A-Z]/;
    // Ellenőrizzük, hogy a jelszó tartalmaz-e legalább egy speciális karaktert (pl. .)
    const hasSpecialChar = /[.]/;

    if (!minLength.test(password)) {
        return { isValid: false, message: "A jelszónak legalább 8 karakter hosszúnak kell lennie." };
    }
    if (!hasUpperCase.test(password)) {
        return { isValid: false, message: "A jelszónak tartalmaznia kell legalább egy nagybetűt." };
    }
    if (!hasSpecialChar.test(password)) {
        return { isValid: false, message: "A jelszónak tartalmaznia kell legalább egy speciális karaktert, például '.'." };
    }
    
    return { isValid: true, message: "A jelszó érvényes." };
}

module.exports = new UserRepository(db);
