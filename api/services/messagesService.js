const messagesRepository = require("../repositories/messagesRepository");

class MessageService {
    async createMessage  (sender_id, receiver_id, content) {
        try {
          
          const newMessage = await messagesRepository.createMessage(
            sender_id,
            receiver_id,
            content
          );
          return newMessage;
        } catch (error) {
          console.error("Hiba az üzenet létrehozásakor a serviceben:", error);
          throw error; 
        }
      };
}

module.exports = new MessageService();
