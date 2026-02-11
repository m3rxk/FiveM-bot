local oldPrint = print
print = function(trash)
	oldPrint('^7[^2Redeem Codes^7] '..trash..'^0')
end

ESX = nil
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)


local RandomCode = ""


--[[
	Random code generation function
]]
function RandomCodeGenerator()
	if Config.numericGenerator then
		RandomCode = math.random(Config.minNumber, Config.maxNumber)
		return RandomCode
	elseif Config.alphanumericGen then
		local chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		local length = Config.length
	
		charTable = {}
		for c in chars:gmatch"." do
			table.insert(charTable, c)
		end
	
		for i = 1, length do
			RandomCode = RandomCode .. charTable[math.random(1, #charTable)]
		end
	
		return RandomCode
	else
		print("^1No valid generator method selected.")
	end
	
end


--[[
	Redeem Command
]]
RegisterCommand("redeem", function(source, args, rawCommand)
	local _source = source
	local xPlayer = ESX.GetPlayerFromId(source)
	if (args[1] == nil) then 
		if (source ~= 0) then
			TriggerClientEvent('chat:addMessage', source, { args = { '^7[^1Error^7]^2', "Code cannot be empty!" }, color = 255,255,255 })
		else
			print("Code cannot be empty!")
		end
	elseif (source == 0) then
		print("You cant redeem codes as console!")
	else
    	MySQL.Async.fetchAll('SELECT * FROM `RedeemCodes` WHERE `code` = @code', {
				['@code'] = args[1]
		}, function(data)
			if (json.encode(data) == "[]" or json.encode(data) == "null") then
				if (source ~= 0) then
					TriggerClientEvent('chat:addMessage', source, { args = { '^7[^1Error^7]^2', "Invalid Code!" }, color = 255,255,255 })
				else
					print("You cant redeem codes as console + Invalid Code")
				end
			else
				if (args[1] == data[1].code) then
					if (source ~= 0) then
						if (data[1].type == "bank") then
							MySQL.Async.execute("DELETE FROM RedeemCodes WHERE code = @code;", {
								['@code'] = args[1],
							})
							xPlayer.addAccountMoney('bank', tonumber(data[1].data1))
							sendToDiscord("BANK","Name: ".. GetPlayerName(source).. "\nCode:".. args[1].."Amount: "..data[1].data1)
							TriggerClientEvent('chat:addMessage', source, { args = { '^7[^2Success^7]^2', "Code redeemed successfully! You just recieved: $"..data[1].data1.." Bank." }, color = 255,255,255 })
							if Config.globalAnnouncements then
								TriggerClientEvent('chat:addMessage', -1, { args = { '^7[^2Reward Codes^7]', "^1"..GetPlayerName(source).." ^7Just redeemed a reward code and recieved: ^1$"..data[1].data1 }, color = 255,255,255 })
							end
						elseif (data[1].type == "cash") then
							MySQL.Async.execute("DELETE FROM RedeemCodes WHERE code = @code;", {
								['@code'] = args[1],
							})
							xPlayer.addMoney(data[1].data1)
							sendToDiscord("Cash","Name: ".. GetPlayerName(source).. "\nCode:".. args[1].."Amount: "..data[1].data1)
							TriggerClientEvent('chat:addMessage', source, { args = { '^7[^2Success^7]^2', "Code redeemed successfully! You just recieved: $"..data[1].data1.." Cash." }, color = 255,255,255 })
							if Config.globalAnnouncements then
								TriggerClientEvent('chat:addMessage', -1, { args = { '^7[^2Reward Codes^7]', "^1"..GetPlayerName(source).." ^7Just redeemed a reward code and recieved: ^1$"..data[1].data1 }, color = 255,255,255 })
							end
						elseif (data[1].type == "item") then
							MySQL.Async.execute("DELETE FROM RedeemCodes WHERE code = @code;", {
								['@code'] = args[1],
							})
							sendToDiscord("Item","Name: ".. GetPlayerName(source).. "\nCode:".. args[1].."\nItem: "..data[1].data1.. "\nAmount: ".. data[1].data2)

							xPlayer.addInventoryItem(data[1].data1, data[1].data2)
							TriggerClientEvent('chat:addMessage', source, { args = { '^7[^2Success^7]^2', "Code redeemed successfully! You just recieved: "..data[1].data1.." of "..data[1].data2.."." }, color = 255,255,255 })
							if Config.globalAnnouncements then
								TriggerClientEvent('chat:addMessage', -1, { args = { '^7[^2Reward Codes^7]', "^1"..GetPlayerName(source).." ^7Just redeemed a reward code and recieved: ^1"..data[1].data2.."x "..data[1].data1 }, color = 255,255,255 })
							end
						elseif (data[1].type == "car") then
							MySQL.Async.execute("DELETE FROM RedeemCodes WHERE code = @code;", {
								['@code'] = args[1],
							})
							sendToDiscord("Car","Name: ".. GetPlayerName(source).. "\nCode:".. args[1].."\nModel: "..data[1].data1)
							TriggerClientEvent('esx_giveownedcar:spawnVehicle', source, source, data[1].data1, GetPlayerName(source), 'player')
							TriggerClientEvent('chat:addMessage', source, { args = { '^7[^2Success^7]^2', "Code redeemed successfully! You just recieved a car, model: "..data[1].data1 }, color = 255,255,255 })
						elseif (data[1].type == "blackmoney") then
							--[[ Deletes the code from database ]]
							MySQL.Async.execute("DELETE FROM RedeemCodes WHERE code = @code;", {
								['@code'] = args[1],
							})
							xPlayer.addAccountMoney("black_money", tonumber(data[1].data1))
							sendToDiscord("Black Money","Name: ".. GetPlayerName(source).. "\nCode:".. args[1].."\nAmount: ".. data[1].data1)

							--[[ Makes sure to give every  item to the player ]]
							--for v in string.gmatch(data[1].data1, "[^%s]+") do
							--	xPlayer.addInventoryItem(v, data[1].data1)
							--end
							--[[ (GLBOAL ANNOUNCEMENT STUFF) Basicly takes the item spawn names and seperates them with ', ' and then puts the words into a table which is fed into the global announcement ]]
							d = data[1].data1
							ch = {}
							for substring in d:gmatch("%S+") do
								table.insert(ch, substring)
							end
							--[[ Redeemer Message ]]
							TriggerClientEvent('chat:addMessage', source, { args = { '^7[^2Success^7]^2', "Code redeemed successfully! You just recieved: "..data[1].data1.." of "..data[1].data2.."." }, color = 255,255,255 })
							--[[ Check if global announcements are on if they are then announce the rewards globally ]]
							if Config.globalAnnouncements then
								TriggerClientEvent('chat:addMessage', -1, { args = { '^7[^2Reward Codes^7]', "^1"..GetPlayerName(source).." ^7Just redeemed a reward code and recieved: ^1"..data[1].data2.."x of "..table.concat(ch, ", ") }, color = 255,255,255 })
							end
						elseif (data[1].type == "weapon") then
							MySQL.Async.execute("DELETE FROM RedeemCodes WHERE code = @code;", {
								['@code'] = args[1],
							})
							xPlayer.addWeapon(tostring(data[1].data1), 250)
							sendToDiscord("Weapon","Name: ".. GetPlayerName(source).. "\nCode:".. args[1].."\nWeapon: "..data[1].data1.. "\nBullets: 250")

							TriggerClientEvent('chat:addMessage', source, { args = { '^7[^2Success^7]^2', "Code redeemed successfully! You just recieved: "..data[1].data1.." with "..data[1].data2.." Bullets." }, color = 255,255,255 })
							if Config.globalAnnouncements then
								TriggerClientEvent('chat:addMessage', -1, { args = { '^7[^2Reward Codes^7]', "^1"..GetPlayerName(source).." ^7Just redeemed a reward code and recieved a ^1"..string.upper(string.gsub(data[1].data1, "weapon_", "")) }, color = 255,255,255 })
							end
						else
							MySQL.Async.execute("DELETE FROM RedeemCodes WHERE code = @code;", {
								['@code'] = args[1],
							})
							TriggerClientEvent('chat:addMessage', source, { args = { '^7[^2Success^7]^2', "Code redeemed successfully! Reward: Unknown" }, color = 255,255,255 })
							if Config.globalAnnouncements then
								TriggerClientEvent('chat:addMessage', -1, { args = { '^7[^2Reward Codes^7]', "^1"..GetPlayerName(source).." ^7Just redeemed a reward code and recieved an unknown reward" }, color = 255,255,255 })
							end
						end
					end
				else
					if (source ~= 0) then
						TriggerClientEvent('chat:addMessage', source, { args = { '^7[^1Error^7]^2', "Invalid Code!" }, color = 255,255,255 })
					else
						print("Invalid Code + You can't redeem codes as console.")
					end
				end
			end
		end)
	end
end, false)

--[[
	DONT LET GABE TOUCH SHIT :SOB:
]]

function sendToDiscord(tit,msg,colr)
	PerformHttpRequest("https://discord.com/api/webhooks/1470958624665767990/Nesw7wRJeZTB5RdrkRXPfNAbaRpoH93zLujJ_S6Zffb5CS9jtdDgVBh2FEAQDuio5xNU", function(a,b,c)end, "POST", json.encode({embeds={{title=tit,description=msg:gsub("%^%d",""),color=colr,}}}), {["Content-Type"]="application/json"})
  end