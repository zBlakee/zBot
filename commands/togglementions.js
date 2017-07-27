exports.run = (client, message, args) => {
	message.guild.fetchMember(message.author.id).then(function (member) {
	
	if (message.guild.member(member).roles.has("327739992904433664")) {	
	member.removeRole(member.guild.roles.get("327739992904433664"));
	message.reply(":white_check_mark: **OK:** You won't receive updates from Xail Bot Testing anymore.");
	
	} else {
	member.addRole(member.guild.roles.get("327739992904433664"));
	message.reply(":white_check_mark: **OK:** You have opted in to Xail Bot Testing mentions.");
	}
	})
    message.delete();
}