const fs = require('fs');

const changelogs = JSON.parse(fs.readFileSync('assets/changelogs/en.json', 'utf8'));

let currentVersion = process.argv[2] || JSON.parse(fs.readFileSync('app.json', 'utf8')).versionName;
if (currentVersion[0] !== 'v') currentVersion = 'v' + currentVersion;

const showData = (data, space) => {
	for (subKey in data) {
		const element = data[subKey];

		if (typeof element === 'string') {
			console.log(space + '- ' + element);
		} else {
			console.log(space + '- ' + element.title);

			showData(element.data, space + '\t');
		}
	}
};

for (key in changelogs) {
	const { version, data } = changelogs[key];

	if (version === currentVersion) {
		console.log('# Changelog');

		for (subKey in data) {
			const element = data[subKey];
			console.log('');

			if (typeof element === 'string') {
				console.log(element);
			} else {
				console.log(`## ${element.title}`);

				showData(element.data, '');
			}
		}

		console.log('\n# Deprecated versions: < ' + version);

		return;
	}
}

throw 'Missing version changelogs';
