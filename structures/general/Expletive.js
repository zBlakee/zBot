const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');
var caughtSwear;
var botDelMessage = true;

function newMessage(message) {
    if (botDelMessage && caughtSwear) {
      if (message.author.id == 303017211457568778) {
        console.log(colors.yellow("▲ Bot is about to delete: " + colors.grey(message)));
        caughtSwear = false;
        message.delete({
          timeout: 8000
        });
      }
    }

    var msg = message.content;
  	if (message.author.bot) return;
    var exp = msg.search(/(\b|\s|^|.|\,|\ )(fuck|penis|cunt|faggot|fark|fck|fag|wank|nigger|nigga|slut|bastard|bitch|asshole|dick|d1ck|d!ck|b1tch|b!tch|blowjob|cock|nigg|fuk|cnut|pussy|c0ck|retard|porn|stfu)(\b|\s|$|.|\,|\ )/i);
    var dxp = msg.search(/(\b|\s|^|.|\,|\ )(cunt|b1tch|b!tch|bitch|cnut)(\b|\s|$|.|\,|\ )/i);

    if (exp != -1) { //Gah! They're not supposed to say that!
    caughtSwear = true;
      if (dxp != -1) { //extra bad word!
        log("▲ Expletive (level 2) caught in message by " + message.author.tag, logType.info);
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
  							value: "Expletives found in message.\n"
  						}
  					],
  					timestamp: new Date()
  				}
  			});
      }
      caughtSwear = true;
    log("▲ Expletive (level 1) caught in message by " + message.author.tag, logType.info);
    switch (Math.floor(Math.random() * 1000) % 21) {
      case 0:
        message.reply("I'm very disappointed in you. :angry:");
        break;
      case 1:
        message.reply("Hey! Let's not have any of that please.");
        break;
      case 2:
        message.reply("No thanks.");
        break;
      case 3:
        message.reply("Cool. Now let's not forget the rules.");
        break;
      case 4:
        message.reply("If I'm not going to delete it, a mod will. Let's save them some work.");
        break;
      case 5:
        message.reply("Hey! That was a swear! No!");
        break;
      case 6:
        message.reply("This situation calls for some passive resistance!");
        break;
      case 7:
        message.reply("Hey! Just cool it.");
        break;
      case 8:
        message.reply("Watch your mouth.");
        break;
      case 9:
        message.reply("I can't believe you've done this...");
        break;
      case 10:
        message.reply("Did you have to say that?");
        break;
      case 11:
        message.reply("You can't say that man!");
        break;
      case 12:
        message.reply("You've triggered me!");
        break;
      case 13:
        message.reply("Woah! Calm down buddy!");
        break;
      case 14:
        message.reply("Won't somebody please just think about the children?");
        break;
      case 15:
        message.reply("Was that necessary?");
        break;
      case 16:
        message.reply("I think you might need to have a quick look at the rules again.");
        break;
      case 17:
        message.reply("Gah! You can't say that!");
        break;
      case 18:
        message.reply("You can't use those words here.");
        break;
      case 19:
        message.reply("If you're going to type that, why not get out a pen and paper and do it yourself?");
        break;
      case 20:
        message.reply("https://cdn.discordapp.com/attachments/325540027972976650/333031862807166977/oGPoUBPq_CTMvEiSVSFVruRc1xMozwglHWxYIrGzUk.png");
        break;
    }
    message.delete();
    return;
  }
}


module.exports = {
    name: "Expletive",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
	}
