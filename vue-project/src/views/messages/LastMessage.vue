<template>
    <div class="last-message" :class="{ 'last-message-outgoing': isOutgoing }">
        <span v-if="isOutgoing">Te: </span>
        {{ formattedLastMessage }}
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'LastMessage',
    props: {
        friendId: {
            type: Number,
            required: true
        },
        loggedInUserId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            lastMessage: null, 
            isOutgoing: false, 
        };
    },
    computed: {
        formattedLastMessage() {
            if (!this.lastMessage || !this.lastMessage.content) {
                return "No messages";
            }
            let message = this.lastMessage.content;
            if (message.length > 30) {
                message = message.substring(0, 30) + "...";
            }
            return message;
        },
    },
    mounted() {
        this.fetchLastMessage();
    },
    methods: {
        async fetchLastMessage() {
            try {
                const response = await axios.get(
                    `http://localhost:3000/notify/lastMessage/${this.friendId}/${this.loggedInUserId}`
                );
                this.lastMessage = response.data;
                
                if (this.lastMessage) {
                    this.isOutgoing = this.lastMessage.sender_id === this.loggedInUserId;
                } else {
                    this.lastMessage = null;
                    this.isOutgoing = false;
                }
            } catch (error) {
                console.error('Error fetching last message:', error);
                this.lastMessage = null;
                this.isOutgoing = false;
            }
        }
    }
};
</script>

<style scoped>
.last-message {
    font-size: 0.9rem;
    color: blue;
}

.last-message-outgoing {
    color: blue;
}
</style>
