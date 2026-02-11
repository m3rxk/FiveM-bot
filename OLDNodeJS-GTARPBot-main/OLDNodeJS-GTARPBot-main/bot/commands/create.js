const Discord = require('discord.js');
const config = require("../config.json");
exports.run = (client, message, args) => { 
var mysql = require('mysql');
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
  const type =  args[1];
  const camot =  args[2];
  const ammo = args[3];
  const key = makeid(35);
  const user = message.mentions.users.first();
  if(!message.member.roles.cache.find(rle => rle.id === config.Roles["Codes"])) {
    return message.channel.send(`${message.author} , no perms.`);
  }
  else
		if (args[1].length == 0) {
      const embed2 = new Discord.MessageEmbed()
  .setColor(config.Embed["color"])
  .setTitle("__"+ config.Embed["ServerName"] +" - Token System__")
  .setThumbnail(config.Embed["logo"])
	.setTitle('Usage')
  .setDescription('**\`!create <@mention> <type> <amount>\`**')
  .addField("Types:", "Item, Bank, Cash, Weapon")
	.setTimestamp()
  .setFooter(config.Embed["footer"])
		return message.channel.send(embed2);
  }
  else
		if (args[2].length == 0) {
      const embed3 = new Discord.MessageEmbed()
  .setColor(config.Embed["color"])
  .setTitle("__"+ config.Embed["ServerName"] +" - Token System__")
  .setThumbnail(config.Embed["logo"])
	.setTitle('Usage')
  .setDescription('**\`!create <@mention> <type> <amount>\`**')
  .addField("Types:", "Item, Bank, Cash, Weapon")
	.setTimestamp()
  .setFooter(config.Embed["footer"])
		return message.channel.send(embed3);
  }
  message.channel.send( `${user}` + ", Has Successfully Received Token In DM's");
const embed = new Discord.MessageEmbed()
  .setColor(config.Embed["color"])
  .setTitle("__"+ config.Embed["ServerName"] +" - Token System__")
  .setThumbnail(config.Embed["logo"])
	.setTitle('A Token Has been sent to you.')
  .setDescription('Here is your Code, To redeem use the command:')
  .addField('Command:', `/redeem ${key}`)
  .addField(`**Key Information:**`, ` This Key Contains: ${camot} ${type}`)
	.setTimestamp()
  .setFooter(config.Embed["footer"])
user.send(embed);

	var con = mysql.createConnection({
    host: config.Sql["host"],
    user: config.Sql["user"],
    password: config.Sql["password"],
    database: config.Sql["database"]
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
var sql = `INSERT INTO RedeemCodes (code, type, data1, data2) VALUES ('${key}', '${type}', '${camot}', '${ammo}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
});
        let guild = message.guild;
        let Logs = guild.channels.cache.find(tkl => tkl.id === config.Channels["TokenLogs"])
        Logs.send({embed: {color: config.Embed["color"], author: {name: 'A Token has been created.', icon_url: 'https://cdn.discordapp.com/emojis/274790281277079552.png?v=1'},
        description: `Created by: \`${message.author.username}\`\ \n Token: \`${key}\`\ \n Amount: \`${type} ${camot}\`\ \n Reciver: \`${user.username}\` `,
        thumbnail: {url: config.Embed["logo"]}, timestamp: new Date(), footer: {text: config.Embed["footer"]}}});
};

exports.help = {
  name: "create",
  category: "System",
  description: "Creates a license key!",
  usage: "-create <@mention> <type> <amount> <ammo>"
};