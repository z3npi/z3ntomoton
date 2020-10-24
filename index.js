const fetch = require('node-fetch');
const tmi = require('tmi.js');

const client_id = process.env.TWITCH_CLIENT_ID;
const client_secret = process.env.TWITCH_CLIENT_SECRET;
const client_token = process.env.TWITCH_CLIENT_TOKEN;

const username = 'z3ntomoton';

const channel = "z3npimusic";

// Get auth token
const auth = async function() {
    const response = await fetch(
        'https://id.twitch.tv/oauth2/token', 
        {
            method: 'post',
            body: JSON.stringify({
                grant_type: 'client_credentials',
                scope: 'chat:read chat:edit',
                client_id,
                client_secret
            }),
            headers: { 'Content-Type': 'application/json' }
        }
    );

    const parsed = await response.json();

    console.debug(parsed);

    return parsed.access_token;
}

const main = async function() {
    // TODO: Fix auth, not working for some reason
    // const token = await auth();

    const options = {
        options: {
            clientId: client_id,
            debug: true
        },
        identity: {
            username,
            password: `oauth:${client_token}`
        }, 
        channels: [ channel ]
    };
    
    const twitch = new tmi.Client(options);

    const handleMessage = function(channel, tags, message, self) {
        if (self) return;
        console.debug(`${channel} (${tags}): ${message}`);
        twitch.say(channel, `${tags.username} said ${message}`);
    }    

    twitch.connect().catch(console.error);
    twitch.on('message', handleMessage)
}

main();