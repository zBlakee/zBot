var git = require('git-last-commit');
const fs = require('fs');
var data = "";
var trimmeddata = "";

class Version {
	static async getVersionNumber(includeVer) {
		await fs.readFile('./data/main/version/vernum.txt', function(err, data) {
		if(err) throw err;
		data = data.toString()
		console.log("I did the thing where I read that file.")

		//includeVer is if you want to include "ver." in the string.
		if (includeVer == "true") {
		console.log(data);
		return data;
	} else {
		trimmeddata = data.substr(5);
		console.log("I've now gone away from reading that particular file, and instead gone to handling said data. Here's what I am looking at: " + trimmeddata)
		return trimmeddata;
	}
});

	}

	static async getLatestCommit() {
		git.getLastCommit(function(err, commit) {
			console.log(commit)
			console.log(err)
			//return commit;
		}, {dst: 'git@github.com:zBlakee/Xail-Bot.git'});
	}

	static getGitHubLink() {
		return "https://www.github.com/zBlakee/Xail-Bot/";
	}
}

module.exports = Version;
