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
if(message.content.startsWith("!revadmin"))
{
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply('אין ברשותך את הגישה כדי להשתמש בפקודה זאת.');
let id = message.content.slice(9).trim().split(' ');
if (!id) return message.channel.send('You need to type a user ID');
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = `DELETE FROM discordleaderboard WHERE discordid = ${id}`;
  con.query(sql, function (err, resultkills) {
    if (err) throw err;
  });
});
message.channel.send(`Removed ${id} To Leaderboard Database.`)
}}
exports.help = {
  name: "revadmin"
};