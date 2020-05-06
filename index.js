require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
const Bot = require('./bot.js');

Bot.initialize();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content.length == 0) return;
    if(msg.content[0] != process.env.BOT_COMMANDPREFIX) return;

    var commandName = msg.content.slice(1);
    var isCommandFound = Object.keys(Bot.commands).indexOf(commandName) != -1;

    var args = msg.content.split(' ').slice(1);

    if(isCommandFound) {
        Bot.commands[commandName](msg, args);
    }
});

client.login(process.env.BOT_TOKEN);