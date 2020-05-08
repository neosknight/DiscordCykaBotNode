require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
const Bot = require('./bot.js');
const Router = require('./web/router.js');
// Bot
Bot.initialize();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content.length == 0) return;
    if(msg.content[0] != process.env.BOT_COMMANDPREFIX) return;

    var commandName = msg.content.split(' ')[0].substring(process.env.BOT_COMMANDPREFIX.length);
    var isCommandFound = Object.keys(Bot.commands).indexOf(commandName) != -1;
    
    var args = msg.content.split(' ').slice(1);

    if(isCommandFound) {
        Bot.commands[commandName](msg, args);
    }
});

client.login(process.env.BOT_TOKEN);

Router.initialize(Bot);

