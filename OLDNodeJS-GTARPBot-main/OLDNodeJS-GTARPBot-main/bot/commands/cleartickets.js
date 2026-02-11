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
if(message.content.startsWith("!cleartickets"))
{
  if(!message.member.roles.cache.some(rle => rle.id === config.Roles["Staff"])) return message.reply('אין ברשותך את הגישה כדי להשתמש בפקודה זאת.');
let id = message.mentions.users.first().id
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
var sql = `DELETE FROM fivemtickets WHERE userid = ${id}`;
  con.query(sql, function (err, resultkills) {
    if (err) throw err;
    message.channel.send(`Cleared ${message.mentions.users.first()} Tickets.`);
  });
});
}}
exports.help = {
  name: "cleartickets"
};