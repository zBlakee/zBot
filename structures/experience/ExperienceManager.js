const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const fs = require('fs');
const sql = require('sqlite');
sql.open('./data/user/userData.sqlite')
var talkedRecently = [];

function newMessage(message) {
  //✦ Experience handler, including levels, badges and experience gained per message. ✦
  message.guild.fetchMember(message.author).then(function(member) {
    const filter = message => message.author.id === member.user.id && member.user.bot == false;
    message.channel.fetchMessages({
      limit: 100
    }).then(messages => {
      if (message.author.bot)
        return;
      if (message.channel.type !== 'text')
        return;
      if (message.channel.id == 325540027972976650)
        return;

      sql.get(`SELECT * FROM experience WHERE userId ='${message.author.id}'`).then(row => {
        if (!row) {
          sql.run('INSERT INTO experience (userId, experience) VALUES (?, ?)', [message.author.id, 1]);
          log("Added a new user to experience database.", logType.info);
        } else {
          // Checks if they have talked recently
          if (talkedRecently.includes(message.author.id)) {
            return;
          } else {
            sql.get(`SELECT * FROM experience WHERE userId ='${message.author.id}'`).then(row => {

              let rand = Math.round(Math.random() * (11 - 4) + 4);
              sql.run(`UPDATE experience SET experience = ${row.experience + rand} WHERE userId = ${message.author.id}`);
              log("Added " + rand + " experience to " + message.author.username + ".", logType.info);
            });
            // Adds the user to the array so that they can't talk for 65 seconds
            talkedRecently.push(message.author.id);
            client.setTimeout(() => {
              const index = talkedRecently.indexOf(message.author.id);
              // Removes the user from the array after 65 seconds
              talkedRecently.splice(index, 1);
            }, 65000);
          }
        }
      }).catch(() => {
        console.error;
        sql.run('CREATE TABLE IF NOT EXISTS experience (userId TEXT, experience INTEGER)').then(() => {
          sql.run('INSERT INTO experience (userId, experience) VALUES (?, ?)', [message.author.id, 1]);
        });
      });

      sql.get(`SELECT * FROM badges WHERE userId ='${message.author.id}'`).then(row => {
        if (!row) {
          sql.run('INSERT INTO badges (userId, developer, active, moderator, essaywriter, subscriber, streamer, xbt, friendship, photographer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [message.author.id, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        } else {
        // Check if message author is zBlake:
        if (message.author.id == 246574843460321291) {
          sql.run(`UPDATE badges SET developer = 1 WHERE userId = ${message.author.id}`);
        }

        // If message author has a moderator role:
        if (member.roles.find("name", "Fleece Police")) {
          sql.run(`UPDATE badges SET moderator = 1 WHERE userId = ${message.author.id}`);
        }

        // If message author is one of the names below (active badge):
        if (member.id == 246574843460321291 || member.id == 284551391781978112 || member.id == 184050823326728193 || member.id == 246129294785380353 || member.id == 224472981571633153 || member.id == 213776985581813760 || member.id == 213776985581813760 || member.id == 196792235654774784) { // add id's here if active
          sql.run(`UPDATE badges SET active = 1 WHERE userId = ${message.author.id}`);
        }

        // If message author has the subscriber role:
        if (member.roles.find("name", "Subscriber")) {
          sql.run(`UPDATE badges SET subscriber = 1 WHERE userId = ${message.author.id}`);
        }

        // If message author has the Xail Bot Testing role:
        if (member.roles.find("name", "Xail Bot Testing")) {
          sql.run(`UPDATE badges SET xbt = 1 WHERE userId = ${message.author.id}`);
        }
        // If message author has 100/100 on the photographer progress badge:
        sql.get(`SELECT * FROM badgeprogress WHERE userId ='${member.id}'`).then(row => {
        if (`${row.photographer}` > 100) {
          sql.run(`UPDATE badges SET photographer = 1 WHERE userId = ${message.author.id}`);
        }
        });

        // If message author is lvl 10 or higher:
        sql.get(`SELECT * FROM experience WHERE userId ='${member.id}'`).then(row => {
        if (`${row.experience}` > 2500) {
          sql.run(`UPDATE badges SET essaywriter = 1 WHERE userId = ${message.author.id}`);
        }
        });

        // If message author is Xailran:
        if (member.id == 196792235654774784) {
          sql.run(`UPDATE badges SET streamer = 1 WHERE userId = ${message.author.id}`);
        }
        }
      }).catch(() => {
        console.error;
        sql.run('CREATE TABLE IF NOT EXISTS badges (userId TEXT, developer INTEGER, active INTEGER, moderator INTEGER, essaywriter INTEGER, subscriber INTEGER, streamer INTEGER, xbt INTEGER, friendship INTEGER, photographer INTEGER)').then(() => {
          sql.run('INSERT INTO badges (userId, developer, active, moderator, essaywriter, subscriber, streamer, xbt, friendship, photographer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [message.author.id, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });
      });

      sql.get(`SELECT * FROM badgeprogress WHERE userId ='${message.author.id}'`).then(row => {
        if (!row) {
          sql.run('INSERT INTO badgeprogress (userId, photographer) VALUES (?, ?)', [message.author.id, 0]);
        }
      //If user posts a picture in #photos, add 1 to photographer badge:
      sql.get(`SELECT * FROM badgeprogress WHERE userId ='${member.id}'`).then(row => {
      if (message.attachments.size > 0) {
        sql.run(`UPDATE badges SET photographer = ${row.photographer + 1} WHERE userId = ${message.author.id}`);
      }
    })
    }).catch(() => {
      console.error;
      sql.run('CREATE TABLE IF NOT EXISTS badgeprogress (userId TEXT, photographer INTEGER)').then(() => {
        sql.run('INSERT INTO badgeprogress (userId, photographer) VALUES (?, ?)', [message.author.id, 0]);
      });
    });

      })
    })
}


module.exports = {
    name: "ExperienceManager",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
  }
