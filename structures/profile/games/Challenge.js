const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');
const fs = require('fs');
const challenge = require('./../../commands/challenge.js');

//Challenges
var health = {};
var healLevel = {};
var timesHealed = {};
var missTurn = {};
var armor = {};
var specialAbilityUsed = {};
var turn = "";
var oppturn = "";
var init = true;
var badgesC = JSON.parse(fs.readFileSync('./data/challenge/equipment.json', 'utf8'));
var userChallenge;

function newMessage(message) {
  var msg = message.content;
  //CHALLENGE
	if (challenge.startedChallenge && message.channel.name == challenge.channel) {
		// Initialization variables
		if (init) {
		health[challenge.author] = 100;
		health[challenge.enemy] = 100;
		armor[challenge.author] = 0;
		armor[challenge.enemy] = 0;
		healLevel[challenge.author] = 1;
		healLevel[challenge.enemy] = 1;
		specialAbilityUsed[challenge.enemy.id] = false;
		specialAbilityUsed[challenge.author.id] = false;
		timesHealed[challenge.enemy.id] = 1
		timesHealed[challenge.author.id] = 1
		turn = challenge.author;
    oppturn = challenge.enemy;
		init = false;
		}

		// Only check for messages that start with attack, defend, heal or end.
		if (msg == "attack" || msg == "defend" || msg == "heal" || msg == "end" || msg == "special") {
		message.delete();
		userChallenge = badgesC[turn.id];
		// Check for turn
		if (message.author.id != turn.id) {
			message.reply(":crossed_swords: **CHALLENGE**: It is not your turn!");
			return;
		}

		if (missTurn[turn.id] == true) {
			message.channel.send(":crossed_swords: **CHALLENGE**: " + turn + " missed their turn.");
			missTurn[turn.id] = false;
			//END TURN
			if (turn == challenge.enemy) {
			turn = challenge.author
      oppturn = challenge.enemy
			} else {
			turn = challenge.enemy
      oppturn = challenge.author
			}

			if (userChallenge.weapon == "gold") {
			message.channel.send(":crossed_swords: **CHALLENGE**: It is " + turn + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `special` `end`");
			} else {
			message.channel.send(":crossed_swords: **CHALLENGE**: It is " + turn + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `end`");
			}

			return;
		}

		if (msg.toLowerCase().startsWith("attack")) {
			let damage = Math.round(Math.random() * (27 - 7) + 7) - armor[challenge.enemy];
			let miss = Math.round(Math.random() * (3 - 1) + 1)

			if (turn == challenge.enemy) {
			damage = Math.round(Math.random() * (27 - 7) + 7) - armor[challenge.author];

			//1/3 chance to miss
			if (miss != 3 || specialAbilityUsed[oppturn.id] == true) {
      specialAbilityUsed[oppturn.id] == false
			//Deduct health
			health[challenge.author] = health[challenge.author] - damage;

			//Check if user has defeated enemy
			if (health[challenge.author] < 1) {
			var winner = challenge.enemy;
			var loser = challenge.author;
			var wowword = "";
			var verb = "";
			var noun = "";

			// WOW WORD
			switch (Math.floor(Math.random() * 1000) % 6) {
						case 0:
							wowword = "Holy cow!"
							break;
						case 1:
							wowword = "Wow!"
							break;
						case 2:
							wowword = "I did not expect that!"
							break;
						case 3:
							wowword = "God damn!"
							break;
						case 4:
							wowword = "Oh my god!"
							break;
						case 5:
							wowword = "No way!"
							break;
			}

			// NOUN
			switch (Math.floor(Math.random() * 1000) % 5) {
						case 0:
							noun = "just"
							break;
						case 1:
							noun = "totally"
							break;
						case 2:
							noun = "kinda"
							break;
						case 3:
							noun = "100%"
							break;
						case 4:
							noun = "absolutely"
						break;
			}

			// VERB
			switch (Math.floor(Math.random() * 1000) % 11) {
						case 0:
							verb = "annihilated"
							break;
						case 1:
							verb = "knocked out"
							break;
						case 2:
							verb = "flogged"
							break;
						case 3:
							verb = "destroyed"
							break;
						case 4:
							verb = "crushed"
							break;
						case 5:
							verb = "ruined"
							break;
						case 6:
							verb = "eradicated"
							break;
						case 7:
							verb = "dismantled"
							break;
						case 8:
							verb = "wiped out"
							break;
						case 9:
							verb = "erased"
							break;
						case 10:
							verb = "squashed"
							break;
			}
			message.channel.send(":crossed_swords: **CHALLENGE**: " + wowword + " " + winner + " " + noun + " " + verb + " " + loser + "! Good fight!")
			return;
			}

			message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.author + " took **" + damage + "** damage. They now have **" + health[challenge.author] + " HP**.")
			} else {
			message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.author + " dodged " + challenge.enemy + "'s attack!");
			}

			} else {
			damage = Math.round(Math.random() * (27 - 7) + 7) - armor[challenge.enemy];

			//1/3 chance to miss
			if (miss != 3) {
			//Deduct health
			health[challenge.enemy] = health[challenge.enemy] - damage;

			//Check if user has defeated enemy
			if (health[challenge.enemy] < 1) {
			var winner = challenge.author;
			var loser = challenge.enemy;
			var wowword = "";
			var verb = "";
			var noun = "";

			// WOW WORD
			switch (Math.floor(Math.random() * 1000) % 6) {
						case 0:
							wowword = "Holy cow!"
							break;
						case 1:
							wowword = "Wow!"
							break;
						case 2:
							wowword = "I did not expect that!"
							break;
						case 3:
							wowword = "God damn!"
							break;
						case 4:
							wowword = "Oh my god!"
							break;
						case 5:
							wowword = "No way!"
							break;
			}

			// NOUN
			switch (Math.floor(Math.random() * 1000) % 4) {
						case 0:
							noun = "just"
							break;
						case 1:
							noun = "totally"
							break;
						case 2:
							noun = "kinda"
							break;
						case 3:
							noun = "100%"
							break;
			}

			// VERB
			switch (Math.floor(Math.random() * 1000) % 11) {
						case 0:
							verb = "annihilated"
							break;
						case 1:
							verb = "knocked out"
							break;
						case 2:
							verb = "absolutely flogged"
							break;
						case 3:
							verb = "destroyed"
							break;
						case 4:
							verb = "crushed"
							break;
						case 5:
							verb = "ruined"
							break;
						case 6:
							verb = "eradicated"
							break;
						case 7:
							verb = "dismantled"
							break;
						case 8:
							verb = "wiped out"
							break;
						case 9:
							verb = "erased"
							break;
						case 10:
							verb = "squashed"
							break;
			}
			message.channel.send(":crossed_swords: **CHALLENGE**: " + wowword + " " + winner + " " + noun + " " + verb + " " + loser + "! Good fight!");
			return;
			}
			message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.enemy + " took **" + damage + "** damage. They now have **" + health[challenge.enemy] + " HP**.")
			} else {
			message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.enemy + " dodged " + challenge.author + "'s attack!");
			}
			}

			//END TURN
			if (turn == challenge.enemy) {
			turn = challenge.author
      oppturn = challenge.enemy
			} else {
			turn = challenge.enemy
      oppturn = challenge.author
			}
		}

		if (msg.toLowerCase().startsWith("defend")) {
			let defense = Math.round(Math.random() * (5 - 2) + 2)

			if (turn == challenge.enemy) {
			if (armor[challenge.enemy] > 7) {
				message.reply(":no_entry_sign: **NOPE**: You are at the maximum defense level!");
				armor[challenge.enemy] = 7;
				return;
			}
			armor[challenge.enemy] = armor[challenge.enemy] + defense;
			message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.enemy + " equiped some armor. They now take **" + defense + " HP** less damage for every attack.")
			} else {
			if (armor[challenge.author] > 7) {
				message.reply(":no_entry_sign: **NOPE**: You are at the maximum defense level!");
				armor[challenge.author] = 7;
				return;
			}
			armor[challenge.author] = armor[challenge.author] + defense;
			message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.author + " equiped some armor. They now take **" + defense + " HP** less damage for every attack.")
			}

			//END TURN
			if (turn == challenge.enemy) {
			turn = challenge.author
      oppturn = challenge.enemy
			} else {
			turn = challenge.enemy
      oppturn = challenge.author
			}
		}

		if (msg.toLowerCase().startsWith("heal")) {
			if (timesHealed[turn.id] < 4) {
			let healAmount = Math.round(Math.random() * (12 - 5) + 5)
			timesHealed[turn.id] = timesHealed[turn.id] + 1

			if (turn == challenge.enemy) {

			// HEAL POTION LEVEL HANDLING
			if (healLevel[challenge.enemy] == 1) {
			healAmount = Math.round(Math.random() * (12 - 5) + 5)
			} else if (healLevel[challenge.enemy] == 2) {
			healAmount = Math.round(Math.random() * (15 - 8) + 8)
			} else if (healLevel[challenge.enemy] == 3) {
			healAmount = Math.round(Math.random() * (18 - 11) + 11)
			}

			health[challenge.enemy] = health[challenge.enemy] + healAmount;
			message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.enemy + " drank a **level " + healLevel[challenge.enemy] + "** health potion. They healed **" + healAmount + " HP**, bringing them up to **" + health[challenge.enemy] + " HP**.");
			} else {

			// HEAL POTION LEVEL HANDLING
			if (healLevel[challenge.author] == 1) {
			healAmount = Math.round(Math.random() * (12 - 5) + 5)
			} else if (healLevel[challenge.author] == 2) {
			healAmount = Math.round(Math.random() * (15 - 8) + 8)
			} else if (healLevel[challenge.author] == 3) {
			healAmount = Math.round(Math.random() * (18 - 11) + 11)
			}

			health[challenge.author] = health[challenge.author] + healAmount;
			message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.author + " drank a **level " + healLevel[challenge.author] + "** health potion. They healed **" + healAmount + " HP**, bringing them up to **" + health[challenge.author] + " HP**.");
			}

			//END TURN
			if (turn == challenge.enemy) {
			turn = challenge.author
      oppturn = challenge.enemy
			} else {
			turn = challenge.enemy
      oppturn = challenge.author
			}
			} else {
			message.reply(":no_entry_sign: **NOPE**: You can't heal anymore.");
			return;
			}
		}



		if (msg.toLowerCase().startsWith("special")) {
			if (userChallenge.weapon == "gold") {
			if (specialAbilityUsed[turn.id] == false) {
			if (turn == challenge.enemy) {
				health[challenge.enemy] = health[challenge.enemy] + 20;
				missTurn[challenge.author.id] = true;
				message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.enemy + " used their special ability: **Gold Frost**! " + challenge.enemy + " gained **20 HP** and " + challenge.author + " will miss their next turn.");
				specialAbilityUsed[challenge.enemy.id] = true;
			} else {
				health[challenge.author] = health[challenge.author] + 20;
				missTurn[challenge.enemy.id] = true;
				message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.author + " used their special ability: **Gold Frost**! " + challenge.author + " gained **20 HP** and " + challenge.enemy + " will miss their next turn.");
				specialAbilityUsed[challenge.author.id] = true;
			}
			} else {
			message.reply(":no_entry_sign: **NOPE**: You've already used your special ability.");
			}
    } else if (userChallenge.weapon == "wood") {
			if (specialAbilityUsed[turn.id] == false) {
			if (turn == challenge.enemy) {
				health[challenge.enemy] = health[challenge.enemy] + 20;
				missTurn[challenge.author.id] = true;
				message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.enemy + " used their special ability: **Intoxication**! " + challenge.enemy + " gained **20 HP** and " + challenge.author + " will miss their next turn.");
				specialAbilityUsed[challenge.enemy.id] = true;
			} else {
				health[challenge.author] = health[challenge.author] + 20;
				missTurn[challenge.enemy.id] = true;
				message.channel.send(":crossed_swords: **CHALLENGE**: " + challenge.author + " used their special ability: **Intoxication**! " + challenge.enemy + " will miss their attack on the next turn.");
        specialAbilityUsed[challenge.author.id] = true;
			}
			} else {
			message.reply(":no_entry_sign: **NOPE**: You've already used your special ability.");
			}
			} else {
			message.reply(":no_entry_sign: **NOPE**: You don't have a special ability to use.");
			}
			//END TURN
			if (turn == challenge.enemy) {
			turn = challenge.author
      oppturn = challenge.enemy
			} else {
			turn = challenge.enemy
      oppturn = challenge.author
			}
		}

		if (userChallenge.weapon !== "") {
		message.channel.send(":crossed_swords: **CHALLENGE**: It is " + turn + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `special` `end`");
		} else {
		message.channel.send(":crossed_swords: **CHALLENGE**: It is " + turn + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `end`");
		}
		return;
		}

	}
}


module.exports = {
    name: "Challenge",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
	}
