fx_version 'cerulean'
games { 'gta5' }

author 'm7rxkk'


client_scripts {
	'client.lua'
}

server_scripts {
    '@async/async.lua',
	'@mysql-async/lib/MySQL.lua',
    'server.lua',
	'config.lua'
}

dependencies {
	'async',
	'mysql-async',
	'es_extended'
}
