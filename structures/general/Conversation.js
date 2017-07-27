const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');

function newMessage(message) {
  var msg = message.content;
	if (message.author.bot) return;
  // Start a conversation with the bot.
	if (message.mentions !== null && message.mentions.users !== null && message.author.bot == false) {
		doNotDelete = true;
		// If the message content starts with a mention to Xail Bot, execute conversation code.
		if (msg.toLowerCase().startsWith("<@303017211457568778>")) {

			if (message.channel.name !== "other_stuff" && message.channel.name !== "bot_testing" && msg.toLowerCase().startsWith("mod:") !== true) {
				doNotDelete = false;
				message.delete();
				message.channel.send(":no_entry_sign: **NOPE**: You need to be in <#297684608940769283> if you want to chat with me.");
				return;
			}

			if (msg.toLowerCase().includes("stop") || (msg.toLowerCase().includes("shut") && msg.toLowerCase().includes("up"))) {

				switch (Math.floor(Math.random() * 1000) % 3) {
					case 0:
						message.reply(":no_entry_sign: **NOPE**: I shall talk as much as I like.");
						break;
					case 1:
						message.reply(":no_entry_sign: **NOPE**: You shu... I'd better not say that actually.");
						break;
					case 2:
						message.reply(":no_entry_sign: **NOPE**: Just no.");
						break;
				}
				//CONVERSATION COMMANDS
			} else if (msg.toLowerCase().includes("fuck you") || msg.toLowerCase().includes("fuck off") || msg.toLowerCase().includes("shit")) {
				message.reply("<:xailFish:303393341704503297>");
			} else if (msg.toLowerCase().includes("how") && msg.toLowerCase().includes("you")) {
				message.reply("I'm doing OK I suppose.");
			} else if (msg.toLowerCase().includes("yes") || msg.toLowerCase().includes("yep") || msg.toLowerCase().includes("right?") || msg.toLowerCase().includes("isn't it?")) {
				message.reply("Well, I suppose so.");
			} else if (msg.toLowerCase().includes("nah") || msg.toLowerCase().includes("nope")) {
				message.reply("I guess not.");
			} else if (msg.toLowerCase().includes("do you")) {
				message.reply("Erm... Maybe? I dunno.");
			} else if (msg.toLowerCase().includes("what is")) {
				message.reply("It's probably 42.");
			} else if (msg.toLowerCase().includes("donate")) {
				message.reply(":information_source: You can donate to Xailran by clicking this link: https://twitch.streamlabs.com/xailran#/ \n:no_entry_sign: Please note that you are absolutely not required to donate to Xail. All donations, no matter the size, are massively welcomed though.");
			} else if (msg.toLowerCase().includes("are you")) {
				message.reply("If that's what you want, okay.");
			} else if (msg.toLowerCase().includes("why is")) {
				message.reply("I don't know, it's probably because of something Xail did.");
			} else if (msg.toLowerCase().includes("can i")) {
				message.reply("It's up to you, mate.");
			} else if (msg.toLowerCase().includes("hello") || msg.toLowerCase().includes("hey") || msg.toLowerCase().includes("howdy") || msg.toLowerCase().endsWith("hi")) {

				switch (Math.floor(Math.random() * 1000) % 6) {
					case 0:
						message.reply("Is it me you're looking for?");
						break;
					case 1:
						message.reply("Hey there! If you ever need help using Xail Bot, just type `+help`!");
						break;
					case 2:
						message.reply("Hello there!");
						break;
					case 3:
						message.reply("Woah, hey there " + message.author.username + "! Didn't know you were here!");
						break;
					case 4:
						message.channel.send("A wild " + message.author + " appeared!");
						break;
				}

				//USER-SPECIFIC COMMANDS
			} else if (msg.toLowerCase().includes("xail") || msg.toLowerCase().includes("xailran")) {
				message.reply("Did you know I am actually based off of that guy?");
			} else if (msg.toLowerCase().includes("zblake") || msg.toLowerCase().includes("blake")) {
				message.reply("Oh, I know that guy! He's an absolute legend.");
			} else if (msg.toLowerCase().includes("puma") || msg.toLowerCase().includes("pumacatrun2")) {
				switch (Math.floor(Math.random() * 1000) % 4) {
					case 0:
						message.reply("same");
						break;
					case 1:
						message.reply(":^)))))))))");
						break;
					case 2:
						message.reply("same u nerd :^)))");
						break;
					case 3:
						message.reply("puma exposed");
						break;
				}
			} else if (msg.toLowerCase().includes("rocker")) {
				switch (Math.floor(Math.random() * 1000) % 4) {
					case 0:
						if (message.author.id == 213776985581813760) {
							switch (Math.floor(Math.random() * 1000) % 3) {
								case 0:
									message.author.send("IMMA FITEACHU LETS GO")
									break;
								case 1:
									message.author.send("you're a derp")
									break;
								case 2:
									message.author.send("https://www.youtube.com/watch?v=4ZaYk7X9KAU\nTHE MUUUSIICCC <3 <3 <3")
									break;
							}
						}
						message.reply("rocker is smol");
						break;
					case 1:
						message.reply("i like yo face " + message.author);
						break;
					case 2:
						message.reply("boi.");
						break;
					case 3:
						message.reply("*mew mew mew mew mew mew mew mew mew mew MEEWW*");
						break;
				}
				//MEME COMMANDS
			} else if (msg.toLowerCase() == "boy i sure do wish i could give money to xailran, he is just such a smart, funny guy that i want to give him funds to help his channel.") {
				message.reply("That is a very specific request you have there!");
			} else if (msg.toLowerCase().includes("+") || msg.toLowerCase().includes("divided") || msg.toLowerCase().includes("-") || msg.toLowerCase().includes("plus") || msg.toLowerCase().includes("subtract") || msg.toLowerCase().includes("minus") || msg.toLowerCase().includes("times") || msg.toLowerCase().includes("*") || msg.toLowerCase().includes("/") || msg.toLowerCase().includes("=")) {
				message.reply("Sorry, I don't know what it is. Go ask Xail, he'd probably know.");
			} else if (msg.toLowerCase().includes("shut down") || msg.toLowerCase().includes("shut off") || msg.toLowerCase().includes("turn off") || msg.toLowerCase().includes("go away") || msg.toLowerCase().includes("shutdown")) {
				message.reply(":white_check_mark: XailBot is now exiting. Goodbye!");
				message.reply("Haha, just kidding.");
			} else if (msg.toLowerCase().includes("but first")) {
				message.reply("We need to talk about parallel universes.");
			}
		}
	}

	// AUTO RESPONSES:
	//
	if (msg == "pizza stream") {
		message.reply("The Pizza of Horror! Toppings: http://prnt.sc/dpki7o")
	} else if (msg == "five survivors") {
		message.reply("https://cdn.discordapp.com/attachments/247302759706132480/251236486131875841/20161118225900_1.jpg")
	} else if (msg == "church of the rainbow sheep") {
		message.reply("Do you have an idea for its history, and adding detail? Please, message Xailran! http://www.steamcommunity.com/groups/churchrainbowsheep")
	} else if (msg == "praise the sheep") {
		message.reply("All hail the rainbow sheep!")
	} else if (msg == "praise the rain") {
		message.reply("Rain = water. Water + Light = refraction. Refraction = Rainbow. Rain is confirmed sheep")
	} else if (msg == "praise the sun") {
		message.reply("The sun provides light. Light = Rainbow. Sun is confirmed Sheep")
	} else if (msg == "praise the rainbow") {
		message.reply("For the rainbow!!!")
	} else if (msg == "pizza dwight") {
		message.reply("Pizza Dwight shenanigans are what keep me going! http://puu.sh/s7m0Z/28cf18bcbc.png")
	} else if (msg == "cheap games") {
		message.reply("You like games? Of course you do! Want to save money? Who doesn't! Follow this link to get a discount off your first order, and to support Xailran at the same time! (He says thanks!) https://greenmangaming.mention-me.com/m/ol/mhm-f386ad9753 Have fun!")
	}
	//
}


module.exports = {
    name: "Conversation",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
	}
