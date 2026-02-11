const discord = require("discord.js");
const config = require("../config.json");
module.exports.run = async (bot, message, args) => {
    const guild = bot.guilds.cache.get(config.Settings["GuildId"]);
    if(!message.content.startsWith('!sug')) return;
    let argsresult;
    message.delete();
    const Logs = guild.channels.cache.find(ch => ch.id === config.Channels["Suggestions"]);
      argsresult = args.join(" ")
      let embed = new discord.MessageEmbed()
      .setTitle("__"+ config.Embed["ServerName"] +" - New Suggestion !__")
      .setColor(config.Embed["color"])
      .setThumbnail(config.Embed["logo"])
      .setTimestamp(new Date())
      .setFooter(config.Embed["footer"])
      .setDescription(`הוצע על ידי: <@${message.author.id}> \n ההצעה: ${argsresult}`)
      Logs.send(embed).then(async (m) => {
       m.react("✅")
        m.react("❌")
      })
}
module.exports.help = {
    name: "sug",
}