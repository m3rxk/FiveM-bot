const Discord = require('discord.js');
const config = require("../config.json");
exports.run = (client, message, args) => { 
var mysql = require('mysql');
	var con = mysql.createConnection({
    host: config.Sql["host"],
    user: config.Sql["user"],
    password: config.Sql["password"],
    database: config.Sql["database"]
});
if(message.content.startsWith("!addadmin"))
{
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply('אין ברשותך את הגישה כדי להשתמש בפקודה זאת.');
let id = message.mentions.users.first()
if (!id) return message.channel.send('You need to mention a user.');
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = `INSERT INTO discordleaderboard (discordid, count) VALUES ('${id.id}', '0')`;
  con.query(sql, function (err, resultkills) {
    if (err) throw err;
  });
});
message.channel.send(`Added ${id} To Leaderboard Database.`)
}}
exports.help = {
  name: "addadmin"
};