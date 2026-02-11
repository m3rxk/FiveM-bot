//-------------------ALL OF THE INTEGERS--------------------\\
const config = require("./config.json");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const mysql = require('mysql');
const fs = require("fs");
const bot = new Discord.Client();
var StatusMsgId = null;
var LeaderBoardMsg = null;
var sql = {};
var con = mysql.createConnection({
    host: config.Sql["host"],
    user: config.Sql["user"],
    password: config.Sql["password"],
    database: config.Sql["database"]
});
bot.commands = new Discord.Collection();
//---------------------------------------------------------\\

//----------------------BOT EVENTS-------------------------\\
bot.on("ready", () => {
    console.log(`${bot.user.username} is active!`);
    con.connect(function (err) {
        try {
            if (err) throw err;
            console.log("Connected!");
            MemberCountChannel();
            Status();
            LeaderBoard()
        } catch {
            console.log("Failed To Connect, Please Try Again!"); 
        }
    });
});

bot.on('channelDelete', async deleted => {
    if(deleted.name.startsWith("ticket-")){
        var deletechannel = `DELETE FROM fivemtickets WHERE channelid = ${deleted.id}`
        try{
            con.query(deletechannel, function (err, result) {
                if (err) throw err;
            })
          }
          catch(e){
            console.log(e)
            }   
    }
    else return;
})


bot.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.cache.find(ch => ch.id === config.Channels["welcome"]);
    if (!channel) return;

    let welemb = new Discord.MessageEmbed()
    .setTitle(config.Embed["ServerName"], config.Embed["logo"])
    .setDescription(`**Welcome, ${member.user.username} To Evolved-Roleplay FiveM! \n We Are at ` + bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0) + ` Members !**`)
    .setThumbnail(member.user.displayAvatarURL({dynamic : true}))
    .setTimestamp(new Date())
    .setColor(config.Embed["color"])
    .setFooter(config.Embed["footer"], config.Embed["logo"])
    channel.send(welemb);
})


bot.on('message', message => {

    if(message.content.startsWith('!ip')){
        var embed = new Discord.MessageEmbed();
        embed.setColor(config.Embed["color"])
        embed.setFooter(config.Embed["footer"], config.Embed["logo"])
        embed.setTitle("__"+ config.Embed["ServerName"] +" - Connection__", config.Embed["logo"])
        embed.setDescription('**Fivem**: `connect ' + config.Embed["ConnectingIP"] + '`\n**TeamSpeak**: `' + config.Embed["TeamSpeakIp"] + '`')
        message.channel.send(embed);
    }

    if(message.content.startsWith('!embedticket')){
        var embed = new Discord.MessageEmbed();
        embed.setColor(config.Embed["color"])
        embed.setFooter(config.Embed["footer"], config.Embed["logo"])
        embed.setTitle("__"+ config.Embed["ServerName"] +" - Ticket System__", config.Embed["logo"])
        embed.setDescription('על מנת לפתוח כרטיס תמיכה, \n יש ללחוץ על הריאקשן מתחת להודעה')
        message.channel.send(embed).then(async (m) => {
            m.react(`${config.Tickets["emoji"]}`)
           });
    }

    if(message.content.startsWith('!embedverify')){
        var embed = new Discord.MessageEmbed();
        embed.setColor(config.Embed["color"])
        embed.setFooter(config.Embed["footer"], config.Embed["logo"])
        embed.setTitle("__"+ config.Embed["ServerName"] +" - Ticket System__", config.Embed["logo"])
        embed.setDescription('על מנת לאשר את עצמכם , \n יש ללחוץ על הריאקשן מתחת להודעה')
        message.channel.send(embed).then(async (m) => {
            m.react("✅")
        });
    }

    if(message.content.startsWith('!ts')){
        var embed = new Discord.MessageEmbed();
        embed.setFooter(config.Embed["footer"], config.Embed["logo"])
        embed.setColor(config.Embed["color"])
        embed.setTitle("__"+ config.Embed["ServerName"] +" - Connection__", config.Embed["logo"])
        embed.setDescription('**TeamSpeak**: `' + config.Embed["TeamSpeakIp"] + '`')
        message.channel.send(embed);
    }
});

bot.on('messageReactionAdd', async (reaction, user) => {
    const guild = bot.guilds.cache.get(config.Settings["GuildId"]);
    if (reaction.message.channel.id === config.Tickets["channel"]) {   
        if (reaction.emoji.name === config.Tickets["emoji"]) {
          var finduser = `SELECT userid,channelid FROM fivemtickets WHERE userid = ${user.id}`;
  con.query(finduser, function (err, resultuser) {
    if(resultuser.length !== 0){
      user.send(`You Already Have A Ticket !`)
    }
    else{
      guild.channels.create(`ticket-${user.id}`, {type: 'text'}).then(c => {
        const Category = guild.channels.cache.find(c => c.id == config.Tickets["catrgory"] && c.type == "category");
        if(!Category) console.info("Tickets category does not exist!");
        c.setParent(Category.id);
        let staff = guild.roles.cache.find(rl => rl.id === config.Roles["Staff"]);
        let everyone = guild.roles.cache.find(rl2 => rl2.id === config.Roles["everyone"]);
        c.updateOverwrite( staff, {SEND_MESSAGES: true, VIEW_CHANNEL: true});
        c.updateOverwrite( everyone, {VIEW_CHANNEL: false});
        c.updateOverwrite( user, {SEND_MESSAGES: true, VIEW_CHANNEL: true});
        const Logs = guild.channels.cache.find(tl => tl.id === config.Tickets["log"]);
            if(!Logs) return;
        let logembed = new Discord.MessageEmbed()
        .setColor(config.Embed["color"])
        .setAuthor("Ticket Created !", 'https://cdn.discordapp.com/emojis/274790281189130242.png?v=1')
        .setDescription(`Created By: \`${user}\` \n User ID: \`${user.id}\` \n Ticket ID: \`${c.id}\` \n Ticket Tag: <#${c.id}>`)
        .setThumbnail(config.Embed["logo"])
        .setTimestamp(new Date())
        .setFooter(config.Embed["footer"])
        Logs.send(logembed)
        let ticketembed = new Discord.MessageEmbed()
        .setColor(config.Embed["color"])
        .setThumbnail(config.Embed["logo"])
        .setTimestamp(new Date())
        .setFooter(config.Embed["footer"])
        .setAuthor(`Hey, ${user.username}`, config.Embed["logo"])
        .setDescription("שלום, כרטיס התמיכה שלך נוצר בהצלחה. \n יש להמתין למענה מצוות השרת.")
        c.send(`${user} \n`, ticketembed)
        var insuser = `INSERT INTO fivemtickets (userid, channelid) VALUES ('${user.id}', '${c.id}')`;
          con.query(insuser, function (err, resultuser) {
            if (err) throw err;
          })
      })
    }
  })}}
  else
  if(reaction.message.channel.id === config.Verify["channel"]){
      let role = guild.roles.cache.get(`${config.Verify["role"]}`)
      const memberWhoReacted = guild.members.cache.find(member => member.id === user.id);
      memberWhoReacted.roles.add(role)
  }
})

bot.on('raw', packet => {
    if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return;
    const channel = bot.channels.cache.get(packet.d.channel_id);
    if (channel.messages.cache.has(packet.d.message_id)) return;
    channel.messages.fetch(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.cache.get(emoji);
        if (reaction) reaction.users.cache.set(packet.d.user_id, bot.users.cache.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            bot.emit('messageReactionAdd', reaction, bot.users.cache.get(packet.d.user_id));
        }
    });
});
//-----------------------------START OF STATUS---------------------------\\

// CREATING/EDIT THE MESSAGE
async function Status() {
    var channel = bot.channels.cache.get(config.Channels["PlayerListCh"]);
    var embed = new Discord.MessageEmbed();
    embed.setAuthor("Player list Initializing", "https://cdn.discordapp.com/attachments/710812134635864206/751445468784885760/YouTube_loading_symbol_3_28transparent29.gif");
    try {
        var messages = await channel.messages.fetch({
            limit: 1
        });
        var msg = await messages.first();
        if (msg.author.id != bot.user.id)
            throw "Couldn't find bot message";
        StatusMsgId = msg.id;
        msg.edit(embed);
        setInterval(() => {
            EditMessage();
        }, 5000);
    } catch {
        const fetched = await channel.messages.fetch({
            limit: 100
        });
        channel.bulkDelete(fetched);
        channel.send(embed).then(message => StatusMsgId = message.id);
        setInterval(() => {
            EditMessage();
        }, 5000);
    }

}
//Edit Message
async function EditMessage() {
    if (!StatusMsgId) return;
    try {
        var channel = await bot.channels.cache.get(config.Channels["PlayerListCh"]);
        var message = await channel.messages.fetch(StatusMsgId);
        try{
            var embed = await generateEmbed();
            message.edit(embed);
        } catch {
            console.error;
        }
    } catch {
        console.error;
    }
}
//Generate Embed
async function generateEmbed() {
    var data = await getPlayersData();
    var embed = new Discord.MessageEmbed();
    //embed.setColor(config.Embed["color"]);
    embed.setThumbnail(config.Embed["logo"])
    embed.setFooter(config.Embed["ServerName"], config.Embed["logo"])
    embed.setTitle("```📈``` **__"+ config.Embed["ServerName"] +" - Server Status__**")

    if (data[0]) {
        var dataplayers = await GetServerInfo(data[1]);
        bot.user.setActivity(`🐌[${dataplayers.length}/${data[2].vars["sv_maxClients"]}] (${memberCount})`, { type: "WATCHING" });
        embed.setDescription(`**Players Online: (${dataplayers.length}/${data[2].vars["sv_maxClients"]}) ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎ ‏‏Queue Count: ${data[2].vars["queue_count"] != undefined ? data[2].vars["queue_count"] : "0"}‏‏**‎`)
        embed.addFields({
            name: "ID",
            value: dataplayers.id,
            inline: true
        }, {
            name: "NAME",
            value: dataplayers.name,
            inline: true
        }, {
            name: "DISCORD",
            value: dataplayers.discord.slice(0, 1012),
            inline: true
        })
    } else {
        bot.user.setActivity(`🐌[OFF] (${memberCount})`, { type: "WATCHING" });
        embed.setDescription('**Server is currently offline \n We will be back as soon as possible!**')
    }
    // if (embed.length > 1024) return;
    return embed;
}
//FETCH
async function getPlayersData() {
    try {
        var data = await fetch(`http://${config.Settings["ServerIP"]}/players.json`);
        var info = await fetch(`http://${config.Settings["ServerIP"]}/info.json`);
        var players = await data.json();
        var infoData = await info.json();
        return [true, players, infoData]
    } catch {
        return [false, undefined, undefined];
    }
}
//SORT DATA TO USE ON EMBED
GetServerInfo = (json) => {
    json.sort(function (a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    });

    var id = "";
    var name = "";
    var discord = "";
    for (let i = 0; i < json.length; i++) {
        id += json[i].id + "\n";
        name += json[i].name + "\n";
        discord += FindDiscord(json[i].identifiers) + "\n";
    }
    if (id == "") {
        id = "None";
        name = "None";
        discord = "None";
    }

    return {
        id: id,
        name: name,
        discord: discord,
        length: json.length
    };
}
//RETURN DISCORD ID
FindDiscord = (identifiers) => {
    var discord = "Not Connected"
    for (let i = 0; i < identifiers.length; i++) {
        var identi = identifiers[i].toString();
        if (identi.indexOf("discord") != -1) {
            discord = `<@${identi.substring(8,identi.length)}>`;
        }
    }
    return discord;
}
//--------------------------END OF STATUS------------------------------\\

async function LeaderBoard() {
    var embed = new Discord.MessageEmbed();
    var channel = bot.channels.cache.get(config.Channels["LeaderChannel"]);
    embed.setAuthor("Leaderboard list Initializing", "https://cdn.discordapp.com/attachments/710812134635864206/751445468784885760/YouTube_loading_symbol_3_28transparent29.gif");
    try {
        var messages = await channel.messages.fetch({
            limit: 1
        });
        var msg = await messages.first();
        if (msg.author.id != bot.user.id)
            throw "Couldn't find bot message";
        LeaderBoardMsg = msg.id;
        msg.edit(embed);
        setInterval(() => {
            EditLeaderBoard();
        }, 5000);
    } catch {
        const fetched = await channel.messages.fetch({
            limit: 100
        });
        channel.bulkDelete(fetched);
        channel.send(embed).then(message => LeaderBoardMsg = message.id);
        setInterval(() => {
            EditLeaderBoard();
        }, 5000);
    }
}

function EditLeaderBoard() {
    sql.GetLeaderBordData(function(data) {
        LeaderBoardList(data);
    });
}

async function LeaderBoardList(data) {
    var info = await ListedBoard(data);
    var embed = new Discord.MessageEmbed();
    embed.setTitle('```👑``` __' + config.Embed["ServerName"] + ' - Ticket Leaderboard__')
    embed.setFooter(config.Embed["footer"], config.Embed["logo"])
    embed.addFields({
        name: "PLACE",
        value: info.place,
        inline: true
    }, {
        name: "DISCORD",
        value: info.discordId,
        inline: true
    }, {
        name: "COUNT",
        value: info.count,
        inline: true
    })
    try {
        var channel = await bot.channels.cache.get(config.Channels["LeaderChannel"]);
        var message = await channel.messages.fetch(LeaderBoardMsg);
        message.edit(embed);
    } catch {
        console.error;
    }
}

//ListedToEmbed
function ListedBoard(array) {
    if (array){
        var discord = '';
        var count = '';
        var places = '';
        var ccount = 1;
        for (player of array) {
                places += `${ccount}\n`;
                discord += `<@${player.discordid}>\n`;
                count += `${player.count}\n`;
                ++ccount;
        }
        return {
            discordId: discord,
            place: places,
            count: count,
        };
    } else {
        return {
            discordId: "None",
            place: "None",
            count: "None",
        };
    }
}

//------------------------------------------------------------\\
// IPOS
//------------------------------------------------------------\\

sql.GetLeaderBordData = function(callback) {
    con.query(`SELECT discordid,count FROM discordleaderboard`, (err, rows) => {
        if (err) throw err
        if (rows.length > 0) {
            return callback(rows)
        } else {
            return callback()
        }
    });
}

//----------------------FUNCTIONS AND COOMANDS-------------------------\\
function MemberCountChannel(){
    var BotCount = 0;
   var myGuild = bot.guilds.cache.get(config.Settings["GuildId"]);
    myGuild.members.cache.forEach(member => {
        if (member.user.bot)
            BotCount++;
    });
    memberCount =  myGuild.memberCount - BotCount;
}

//----------------------Commands Folder-------------------------\\
fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
      console.log("Couldn't find commands.");
      return;
    }
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
    });
});
//----------------------CMDS PREFIX NATIVE-------------------------\\

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let prefix = "/";
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);
})
//-----------------------------TOKEN-----------------------------------\\
bot.login(config.Settings["Token"]);
//-----------------------------TOKEN-----------------------------------\\