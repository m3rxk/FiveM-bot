const Discord = require('discord.js');
const config = require("../config.json");
module.exports.run = async (bot, message, args) => {
    if(message.content.startsWith("!name"))
    {
        if(!message.member.roles.cache.some(rle => rle.id === config.Roles["Staff"])) return message.reply('אין ברשותך את הגישה כדי לשנות שם לטיקט.');
        const guild = bot.guilds.cache.get(config.Settings["GuildId"]);
        let args2 = message.content.slice(5).trim().split(' ')
        const reason = args2.join(" ");
        if(!message.channel.name.startsWith('ticket-')) {
             return message.reply('עליך להשתמש בפקודה זאת אך ורק בטיקטים!');
        }
        else
        {
        message.channel.setName(`ticket-${reason}`);
        message.delete();
        }
            const Logs = guild.channels.cache.find(tl => tl.id === config.Tickets["log"]);
            if(!Logs) return;

            Logs.send({embed: {color: config.Embed["color"], author: {name: 'Ticket Name Changed', icon_url: 'https://cdn.discordapp.com/emojis/274790281189130242.png?v=1'},
            description: `Changed By: \`${message.author.tag}\`\ \n Name: \`${reason}\`\ \nUserid: \`${message.author.id}\`\ \nTicket: \`ticket-${reason}\`\ `,
            thumbnail: {url: config.Embed["logo"]}, timestamp: new Date(), footer: {text: config.Embed["footer"]}}});
    }
}
module.exports.help = {
    name: 'name'
}