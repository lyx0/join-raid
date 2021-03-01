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
    await client.join('uudelleenkytkeytynyt')
    await client.join('teischente')

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
    client.say('uudelleenkytkeytynyt', 'Running');
});

// ################


client.on('PRIVMSG', (msg) => {
    if (msg.displayName === 'HuwoBot' &&
        msg.messageText.startsWith('A Raid Event at Level') && 
        msg.channelName.toLowerCase() === 'teischente') {
        let users = fs.readFileSync('users.txt').toString().split('\n').filter(u => u).map(u => ' @' + u);
        console.log(users)
        client.say(msg.channelName, `RAID DETECTED pajaGIGA 🚨 ${users}`)
    }
})

client.on('PRIVMSG', (msg) => {
    if (msg.messageText.startsWith('()remindme') || 
        msg.messageText.startsWith('()join') &&
        msg.channelName.toLowerCase() === 'teischente') {
        let nameToAdd = msg.displayName.toString()
        fs.appendFile('users.txt', `\n${nameToAdd}`, function (err) {
            if (err) {
                client.say(msg.channelName, 'Something went wrong FeelsBadMan')
            } else {
                client.say(msg.channelName, `@${nameToAdd}, I will now ping you when a raid happens :)`)
            }
        })
    }
})

client.on('PRIVMSG', (msg) => {
    if (msg.messageText.startsWith('()help')) {
        client.say(msg.channelName, 'Use ()remindme or ()join to get nofitied of raids!')
    }
})

client.initialize();