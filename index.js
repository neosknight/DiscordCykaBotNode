require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
const Bot = require('./bot.js');

const express = require('express');
var expressApp = express();

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

// Express web server
expressApp.get('/hello', (req, res) => {
    res.send('<h1>Hello world!</h1>');
});

expressApp.listen(3000);