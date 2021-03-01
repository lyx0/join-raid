const Twitch = require('dank-twitch-irc');
const fs = require('fs');

require('dotenv').config();

const client = new Twitch.ChatClient({
    username: process.env.TWITCH_USER,
    password: process.env.TWITCH_PASSWORD,
    rateLimits: 'default',
    ignoreUnhandledPromiseRejections: 'true',
});

// Allows the bot to send the same message
client.use(new Twitch.AlternateMessageModifier(client));

// Allows the bot to know if they're mod/vip/sub or pleb
client.use(new Twitch.UserStateTracker(client));

// Rate Limiter so we don't get globaled
client.use(new Twitch.SlowModeRateLimiter(client, 2));

// Initialize Client
client.initialize = async () => {
    await client.join('nouryqt')
    await client.join('nrybot')

    await client.connect();
};

// Connection was interrupted
client.on('close', (error) => {
    if (error != null) {
        console.error('Client closed due to error', error);
    }
});

// Connection was successful
client.on('ready', () => {
    console.log('Successfully connected to chat');
    client.say('nouryqt', 'Running');
});

const users = fs.readFileSync('users.txt').toString().split('\n').filter(u => u).map(u => ' @' + u);

client.on('PRIVMSG', (msg) => {
    if (msg.messageText.startsWith('()xd')) {
        console.log(users)
        client.say(msg.channelName, `RAID DETECTED pajaGIGA 🚨 ${users}`)
    }
})

client.initialize();