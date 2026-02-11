const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
  if(message.content.startsWith("-ann"))
  {
    let channel = message.mentions.channels.first();
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("אין לך הרשאה לבצע פקודה זאת.");
    }
    if (!channel) {
      return message.channel.send("Please mention the announcement channel first");
    }
    channel.send("**__הכרזה:__** \n " + args.slice(1).join(" "));
  }
}
  module.exports.help = {
      name: 'ann'
  }

