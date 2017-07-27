/****************************************
 *
 *   Xail Bot: An all-in-one bot designed for Rainbow Gaming.
 *   Copyright (C) 2017 Victor Tran and Rylan Arbour
 *	 Rewritten and redesigned by zBlake
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * *************************************/
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const api = require('./data/main/keys/keys.js');
//This is just to make the console look fancier
var colors = require('colors');
const replace = require("replace");
const maintenanceM = require('./commands/debug/maintenance.js');
const events = require('events');
const commandEmitter = new events.EventEmitter();

global.logType = {
    debug: 0,
    info: 1,
    warning: 2,
    critical: 3,
    success: 4
}

global.log = function(logMessage, type = logType.debug) {
    if (type == logType.debug) {
        if (process.argv.indexOf("--debug") == -1) {
            return;
        }
    }

    var logString;
		var logFormatting;
    switch (type) {
        case logType.debug:
            logFormatting = colors.bgMagenta(colors.white("[ DEBUG ]"));
            break;
        case logType.info:
						logString = colors.white(logMessage);
            logFormatting = colors.white("[ INFO ]");
            break;
        case logType.warning:
						logString = colors.yellow(logMessage);
            logFormatting = colors.bgYellow(colors.black("[ WARNING ]"));
            break;
        case logType.critical:
						logString = colors.bgRed(colors.white(logMessage));
            logFormatting = colors.bgRed(colors.white("[ CRITICAL ]"));
            break;
        case logType.success:
						logString = colors.green(logMessage);
            logFormatting = colors.bgGreen(colors.black("[ SUCCESS ]"));
            break;
    }
    console.log(logFormatting, logString);
}

//Maintenance check
var maintenance = false;
if (maintenanceM.maintenanceEnabled == true) {
	maintenance = true;
} else {
	maintenance = false;
}

const expletiveFilter = require('./commands/filter.js');
const doModeration = require('./commands/mod.js');
const panicMode = require('./commands/panic.js');
const debug = require('./commands/debug/toggle.js');
const Experience = require('./structures/profile/Experience.js');
const Spam = require('./structures/general/Spam.js')
Spam.constructor(client, commandEmitter);
const Expletive = require('./structures/general/Expletive.js')
Expletive.constructor(client, commandEmitter);
const Conversation = require('./structures/general/Conversation.js')
Conversation.constructor(client, commandEmitter);
const Challenge = require('./structures/games/Challenge.js')
Challenge.constructor(client, commandEmitter);
const ExperienceManager = require('./structures/experience/ExperienceManager.js')
ExperienceManager.constructor(client, commandEmitter);
const CommandHandler = require('./structures/general/CommandHandler.js')
CommandHandler.constructor(client, commandEmitter);

//Console
var sudoCommand = "";
var currentGuild = "";
var currentChannel = "";

//Misc.
var userAFK = [];

//Moderation
var doNotDelete = false;
var caughtLink = false;
var caughtKYS = false;
var ignoreMessage = false;
doModeration[196793479899250688] = true;

async function setGame() {
	let presence = {};
	presence.game = {};
	presence.status = "online";
	presence.afk = false;

	await fs.readFile('./data/main/setGame/setGame.txt', function(err, data){
	if(err) throw err;
	data = data.toString();
	var fileContentLines = data.split( '\n' );
	var randomLineIndex = Math.floor( Math.random() * fileContentLines.length );
	var randomLine = fileContentLines[ randomLineIndex ];
	presence.game.name = randomLine;
	client.user.setPresence(presence);
	})

}

client.on('ready', () => {
	log("> Xail Bot is now online!", logType.success)
	client.setInterval(setGame, 300000);
	setGame();
});

function messageChecker(oldMessage, newMessage) {
	var message;

	if (newMessage == null) {
		message = oldMessage;
	} else {
		message = newMessage;
	}
	var msg = message.content;

	if (message.guild == null) return;
  commandEmitter.emit('newMessage', message);

	exports.userAFK = userAFK;

	if (message.mentions.users.size > 0 && message.author.bot == false) {
		if (userAFK.indexOf(message.mentions.users.first().id) > -1) {
			message.reply(":information_source: **" + message.mentions.users.first().username + "** is currently *AFK*. They may not respond to your message for a while.").then(message => {
				message.delete({
					timeout: 8000
				});
			});
		}
	} else {}



	// If doModeration has no value, init to true.
	if (doModeration.enabled == null || undefined) {
		doModeration.enabled = true;
	}

	// If expletiveFilter has no value, init to true.
	if (expletiveFilter.enabled == null || undefined) {
		expletiveFilter.enabled = true;
	}

	// If panicMode has no value, init to false.
	if (panicMode.enabled == undefined) {
		panicMode.enabled = false;
	}

	// When panic mode is enabled, delete all messages.
	if (panicMode.enabled) {
		message.delete();
	}

	if (message.author.id !== 303017211457568778 && !message.author.bot) {
		if (doModeration.enabled) { //Check if we should do moderation on this server

			// Is the first word in message content found more than [x] times?
			function regexEscape(str) {
				if (str == null)
					return;
				return str.toString().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			}

			function reg(input) {
				var flags;
				//could be any combination of 'g', 'i', and 'm'
				flags = 'gi';

				if (input == null)
					return;
				input = regexEscape(input);

				return new RegExp('[a-zA-Z ](' + input + '){10,}', flags);
			}

			//This below code is testing how many characters in a single post, and if there are more than 17 (subject to change) then delete message.
			//Check for spam in a single message
			console.log(colors.gray("[ MESSAGE ] " + message.author.username + " » " + msg));
			if (/(\*(\*))?(~~)?(`)?(__(\*)(\*\*)(\*\*\*))?(.)\9{17,}[^0-9]/gi.test(msg) == true) {
				caughtSpam = true;
				message.delete()
				return;
			} else if (reg(msg.match(/(\*(\*))?(~~)?(`)?(__(\*)(\*\*)(\*\*\*))?^(\S+)\s/gi)) !== undefined) {
				if (reg(msg.match(/(\*(\*))?(~~)?(`)?(__(\*)(\*\*)(\*\*\*))?^(\S+)\s/gi)).test(msg) == true) {
					ignoreMessage = true;
					message.delete()
					return;
				}
			}

			}

			// Special case if message content contains "kill yourself".
			if (message.author.id != 303017211457568778 && msg.search(/\b(kys|kill yourself|k-y-s|k y s|k ys|k ys|k i l l yourself|k i l l y o u r s e l f|k-ys|ky-s|kill y o u r s e l f|kill ys|k yourself|killyourself|k y o u r s e l f|kill urself|k.y.s.|k-y-s.|ky-s.|k-ys.|k y s.|ky s.|k ys.)\b/i) != -1) {
				var auth = message.author;
				caughtKYS = true;
				message.reply("Right, we don't appreciate that here.");
				message.delete();
			}

			// If the RegEx "exp" executes successfully and finds a match, remove the message.
			// Link filter
			if (message.member != null) { //*!(message.member.roles.find("name", "Fleece Police"))
				//exp = msg.search(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{5,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&// = ]*)/i);
				exp = msg.search(/.*?(http\:\/\/www\.[a-zA-Z0-9\.\/\-]+)/);
				if (exp != -1) { //This is a link.
					if (message.member.roles.find("name", "Fleece Police") || message.member.roles.find("name", "Permitted")) {
					} else if (message.channel.name == "self_promos" || message.channel.name == "music" || message.channel.name == "bot_testing" || message.channel.name == "meme_dungeon" || message.channel.name == "photos" || message.channel.name == "minecraft_ideas") {
					} else if (msg.toLowerCase().includes("twitch.tv/xailran") || msg.toLowerCase().includes("www.youtube.com") || msg.toLowerCase().includes("www.reddit.com") || msg.toLowerCase().includes("discord.gg")) {
					} else {
						caughtLink = true;
						log("▲ Unapproved link caught in message by " + message.author.tag, logType.info);
						message.delete();
            fs.readFile('./data/main/filter/linkCaughtMessage.txt', function(err, data) {
          	if(err) throw err;
          	data = data.toString();
          	let fileContentLines = data.split( '\n' );
          	let randomLineIndex = Math.floor( Math.random() * fileContentLines.length );
          	let randomLine = fileContentLines[ randomLineIndex ];
        		message.reply(randomLine);
            })
						return;
					}
				}
			}
		}
  }
// END OF MESSAGE Function

client.on('message', messageChecker);
client.on('messageUpdate', messageChecker);


process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', sendCLIMessage);

function sendCLIMessage(text) {
	text = text.trim();
	currentGuild = client.guilds.first(); //because Xail Bot is only connected to 1 guild
	currentGuild.channels.forEach(function (channel) {
	if (channel.name == "bot_testing") {
			currentChannel = channel
	}
	})
	switch (text) {
		case "stop":
			log("Xail Bot will now shutdown.", logType.info)
			process.exit(0);
			break;
		case "setchannel":
			log("Set text channel to nothing.", logType.info)
			currentChannel = "";
			break;
		default:
			if (text.startsWith("log")) {
				log(text.substr(4), logType.info);
			} else if (text.startsWith("setchannel")) {
				if (currentGuild != "") {
					currentGuild.channels.forEach(function (channel) {
						if (channel.name == text.substr(11)) {
							currentChannel = channel;
							log("Set text channel to #" + text.substr(11) + ". All messages sent through the 'send' command will be redirected to that channel.", logType.info)
						}
					})
				} else {
					return;
				}
			} else if (text.startsWith("send")) {
				if (currentChannel != "") {
					currentChannel.send(text.substr(5))
				}
		} else if (text.startsWith("sudo")) {
			if (currentChannel != "") {
				currentChannel.send(sudoCommand);
			}
		}
	}
}

client.on('guildMemberAdd', function(guildMember) {
	if (guildMember.guild.id == 196793479899250688) {
		guildMember.addRole(guildMember.guild.roles.get("224372132019306496"));

		channel = client.channels.get("196793479899250688");
		let randomjoin = "";
		switch (Math.floor(Math.random() * 1000) % 7) {
			case 0:
				randomjoin = "Please give them a warm welcome!";
				break;
			case 1:
				randomjoin = "Thanks for joining, and we hope you enjoy your stay!";
				break;
			case 2:
				randomjoin = "Thanks for joining us!";
				break;
			case 3:
				randomjoin = "It's great to have you here!";
				break;
			case 4:
				randomjoin = "It's a pleasure to have you here.";
				break;
			case 5:
				randomjoin = "Hope you have had a great day so far!";
				break;
			case 6:
				randomjoin = "Nice to see you!";
				break;
		}
		channel.send("**" + guildMember + "** has joined our awesome server! *" + randomjoin + "*")

		channel = client.channels.get("229575537444651009");
		channel.send({
			embed: {
				color: 3191350,
				author: {
					name: "ᴜꜱᴇʀ ᴊᴏɪɴᴇᴅ »  " + guildMember.user.tag,
					icon_url: guildMember.user.displayAvatarURL
				},
				fields: [{
						name: '**Discriminator**',
						value: "#" + guildMember.user.discriminator
					},
					{
						name: '**User Created**',
						value: guildMember.user.createdAt.toDateString() + " at " + guildMember.user.createdAt.toLocaleTimeString()
					},
					{
						name: '**User Joined**',
						value: guildMember.joinedAt.toDateString() + " at " + guildMember.joinedAt.toLocaleTimeString()
					}
				],
				timestamp: new Date()
			}
		});

	}
});

client.on('guildMemberRemove', function(guildMember) {
	if (guildMember.guild.id == 196793479899250688) {
		channel = client.channels.get("229575537444651009");
		channel.send({
			embed: {
				color: 13724718,
				author: {
					name: "ᴜꜱᴇʀ ǫuı »  " + guildMember.user.tag,
					icon_url: guildMember.user.displayAvatarURL
				},
				fields: [{
						name: '**Username**',
						value: guildMember.user.tag
					},
					{
						name: '**User Joined**',
						value: guildMember.joinedAt.toDateString() + " at " + guildMember.joinedAt.toLocaleTimeString()
					}
				],
				timestamp: new Date()
			}
		});

	}
});

client.on('messageDelete', function(message) {
	if (message.content.startsWith("+"))
return;
	var channel = null;

	if (message.guild != null) {

		if (message.guild.id == 196793479899250688) { //General chat for testbot
			channel = client.channels.get("229575537444651009");
		}

		if (panicMode[message.guild.id])
			return; //Don't want to be doing this in panic mode!
		if (message.author.id == 303017211457568778)
			return;
		if (message.author.id == 155149108183695360)
			return; //Dyno
		if (message.author.id == 184405311681986560)
			return; //FredBoat
		if (ignoreMessage) {
			ignoreMessage = false;
			return;
		}

		if (caughtKYS == true) {
			caughtKYS = false;

			channel = client.channels.get("229575537444651009");
			channel.send({
				embed: {
					color: 14714691,
					author: {
						name: "ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.tag,
						icon_url: message.member.user.displayAvatarURL
					},
					description: ":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was removed.\n",
					fields: [{
							name: '**Message**',
							value: message.cleanContent
						},
						{
							name: '**Reason**',
							value: "Death threat contained in message.\n"
						}
					],
					timestamp: new Date()
				}
			});
			return;
		} else if (caughtLink == true) {
			caughtLink = false;

			channel = client.channels.get("229575537444651009");
			channel.send({
				embed: {
					color: 14714691,
					author: {
						name: "ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.tag,
						icon_url: message.member.user.displayAvatarURL
					},
					description: ":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was removed.\n",
					fields: [{
							name: '**Message**',
							value: message.cleanContent
						},
						{
							name: '**Reason**',
							value: "Unconfirmed link contained in message.\n"
						}
					],
					timestamp: new Date()
				}
			});
			return;
		}
	}
});

client.on('messageDeleteBulk', function(messages) {
	var channel = null;

	if (panicMode[messages.first().guild.id])
		return; //Don't want to be doing this in panic mode!

	//Debugging information.
	if (maintenance == true) {
	channel = client.channels.get("325540027972976650");
	channel.send(":page_facing_up: **DEBUG:** BulkDelete function called. Deleted " + messages.size + " messages.");
	}

	channel = client.channels.get("229575537444651009");

	if (channel != null) {
		log("▲ " + messages.size + " messages deleted using bulkDelete.", logType.warn);
	}

});

client.on('messageUpdate', function(oldMessage, newMessage) {
	if (oldMessage.cleanContent == newMessage.cleanContent) return; //Ignore
	var channel = null;
	if (oldMessage.guild != null) {
		if (oldMessage.guild.id == 196793479899250688) {
			channel = client.channels.get("229575537444651009");
		}

		if (channel != null) {
			if (oldMessage.author.bot) return;
			if (oldMessage.member.roles.find("name", "Fleece Police") || oldMessage.member.roles.find("name", "Head of the Flock")) {
				return;
			} else {
				channel = client.channels.get("229575537444651009");
				channel.send({
					embed: {
						color: 16040514,
						author: {
							name: "ᴍᴇꜱꜱᴀɢᴇ ᴇᴅɪᴛᴇᴅ »  " + oldMessage.author.tag,
							icon_url: oldMessage.author.displayAvatarURL
						},
						description: ":pencil: Message by <@" + oldMessage.author.id + "> in <#" + oldMessage.channel.id + "> was edited.\n",
						fields: [{
								name: '**Old Content**',
								value: oldMessage.cleanContent
							},
							{
								name: '**New Content**',
								value: newMessage.cleanContent
							}
						],
						timestamp: new Date()
					}
				});
				return;
			}
		}
	}
});

process.on("unhandledRejection", err => {
	log("[UNCAUGHT PROMISE] " + err.stack, logType.critical);
});


client.login(api.key()).catch(function() {
	log("Xail Bot failed to establish a connection to the server.", logType.critical);
});
