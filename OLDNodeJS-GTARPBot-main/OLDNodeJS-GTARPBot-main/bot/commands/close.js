const Discord = require('discord.js');
const config = require("../config.json");
var mysql = require('mysql');
var con = mysql.createConnection({
  host: config.Sql["host"],
  user: config.Sql["user"],
  password: config.Sql["password"],
  database: config.Sql["database"]
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
module.exports.run = async (bot, message, args) => {
    if(message.content.startsWith("-close"))
    {
        const guild = bot.guilds.cache.get(config.Settings["GuildId"]);
        if(!message.member.roles.cache.some(rle => rle.id === config.Roles["Staff"])) return message.reply('אין ברשותך את הגישה כדי לסגור טיקטים.');
        if(!message.channel.name.startsWith('ticket-')) return message.reply('עליך להשתמש בפקודה זאת אך ורק בטיקטים!');
        let args2 = message.content.slice(7).trim().split(' ');
        let topal = message.mentions.members.first();
        if (!topal) return message.channel.send('You need to mention a user.');
        const reason = args2.join(" ");
        if(!reason) return message.reply({embed: {color: config.Embed["color"], fields: [{name: 'Ticket Status', value: `יש לציין סיבה כדי לסגור כרטיס תמיכה.`}], timestamp: new Date(), footer: {text: config.Embed["footer"]}}});

        const Logs = guild.channels.cache.find(ch => ch.id === config.Tickets["log"]);
        if(!Logs) return;
        Logs.send({embed: {color: config.Embed["color"], author: {name: 'Ticket Closed', icon_url: 'https://cdn.discordapp.com/emojis/274790281277079552.png?v=1'},
        description: `Closed by: \`${message.author.tag}\`\ \nReason: \`${reason}\`\ \nAdmin-id: \`${message.author.id}\`\ \nTicket closed: \`ticket-${message.channel.name}\`\ `,
        thumbnail: {url: config.Embed["logo"]}, timestamp: new Date(), footer: {text: config.Embed["footer"]}}});
        message.channel.send({embed: {color: config.Embed["color"], fields: [{name: 'Ticket Status', value: `סטטוס שונה: **${reason}** נסגר בעוד **10 שניות**`}], timestamp: new Date(), footer: {text: config.Embed["footer"]}}});
        var sql = `UPDATE discordleaderboard SET count = count +1 WHERE discordid = ${topal.id}`;
          try{
            con.query(sql, function (err, result) {
                if (err) throw err;
            })
          }
          catch(e){
            console.log(e)
            }
        var deletechannel = `DELETE FROM fivemtickets WHERE channelid = ${message.channel.id}`
            con.query(deletechannel, function (err, result) {
              if (err) throw err;
            });
        setTimeout(function(){
            message.channel.delete();
        }, 10000);
    }
}})

module.exports.help = {
    name: 'close'
}