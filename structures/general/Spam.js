const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();

var spamObject = {
    lastMessages: {},
    spamCounting: {},
    nonSpamCounting: {}
};

function newMessage(message) {
	if (message.author.bot) return;
	var msg = message.content

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

        //Spam filtering enabled for this server
        var lastMessagesOfUser = spamObject.lastMessages[message.author.id];
        if (lastMessagesOfUser == null) {
            lastMessagesOfUser = [];
        }

        var spamCountingUser = spamObject.spamCounting[message.author.id];
        if (spamCountingUser == null) {
            spamCountingUser = 0;
        }

        var nonSpamCountingUser = spamObject.nonSpamCounting[message.author.id];
        if (nonSpamCountingUser == null) {
            nonSpamCountingUser = 0;
        }

        var messageText = message.content.toLowerCase();
        if (messageText.length > 3) {
            if (lastMessagesOfUser.includes(messageText)) {
                spamCountingUser++;

                if (nonSpamCountingUser > 0) {
                    nonSpamCountingUser--;
                }

                if (spamCountingUser >= 3) {
									message.channel.send(spamCountingUser)
                    if (spamCountingUser == 6) {
											message.reply("Quite enough of this. I'm not warning you anymore.")
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
															value: "Spamming.\n"
														}
													],
													timestamp: new Date()
												}
											});
                    } else if (spamCountingUser > 6) {

                    } else {
                        //warning messages
												log("▲ Spam limits activated for " + message.author.tag, logType.info);
												switch (Math.floor(Math.random() * 1000) % 6) {
													case 0:
														message.reply("Well... We all heard you.").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 1:
														message.reply("Stop typing the same thing! You're like a broken record!").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 2:
														message.reply("Hmm... Not sure if you'd actually say the same thing more than three times in public.").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 3:
														message.reply("Is that the only phrase you know? Can you try typing something else?").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 4:
														message.reply("Pollution is not the solution, my friend.").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 5:
														message.reply("Can't you think of anything else to say?").then(message => {
														message.delete({
															timeout: 8000
														});
													})
														break;
                    }
									}
									message.delete();
                }
            } else {
                //Add last message to array
                lastMessagesOfUser.push(messageText);

                //Remove 11th message if there is one
                if (lastMessagesOfUser.length > 10) {
                    lastMessagesOfUser.splice(0, 1);
                }

                nonSpamCountingUser++;
            }

            if (nonSpamCountingUser == 10) {
                spamCountingUser = 0;
                nonSpamCountingUser = 0;
            }
        }

        //Set Variables
        spamObject.lastMessages[message.author.id] = lastMessagesOfUser;
        spamObject.spamCounting[message.author.id] = spamCountingUser;
        spamObject.nonSpamCounting[message.author.id] = nonSpamCountingUser;
}


module.exports = {
    name: "Spam",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
	}
