const discord = require("discord.js");
const config = require("../config.json");
module.exports.run = async (bot, message, args) => {
    const guild = bot.guilds.cache.get(config.Settings["GuildId"]);
    if(!message.content.startsWith('-hm')) return;
    let argsresult;
    let mChannel = message.mentions.channels.first();
    message.delete();
    const Logs = guild.channels.cache.find(ch => ch.id === config.Tickets["log"]);
    if(mChannel) {
        argsresult = args.slice(1).join(" ");
        mChannel.send(argsresult)
    }else{
        argsresult = args.join(" ")
        message.channel.send('סטטוס כרטיס התמיכה: **ממתין למענה מצד**\n\n' + argsresult);
    }
    Logs.send({embed: {color: config.Embed["color"], author: {name: '-hm Used', icon_url: 'https://cdn.discordapp.com/emojis/274790281189130242.png?v=1'},
            description: `Used by: \`${message.author.tag}\` \n Message: \`${message.content}\`\ `,
            thumbnail: {url: config.Embed["logo"]}, timestamp: new Date(), footer: {text: config.Embed["footer"]}}});
}
module.exports.help = {
    name: "hm",
}