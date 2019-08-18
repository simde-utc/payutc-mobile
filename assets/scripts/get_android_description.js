const fs = require('fs');

const currentVersion = `v${JSON.parse(fs.readFileSync('app.json', 'utf8')).versionName}`;

const showData = (data, space) => {
	for (subKey in data) {
		const element = data[subKey];

		if (typeof element === 'string') {
			console.log(space + '- ' + element);
		} else {
			console.log(space + '- ' + element.title);

			showData(element.data, space + '  ');
		}
	}
};

const showChangelog = (lang, langText) => {
	const changelogs = JSON.parse(fs.readFileSync('assets/changelogs/' + lang + '.json', 'utf8'));

	console.log('<' + langText + '>');

	for (key in changelogs) {
		const { version, data } = changelogs[key];

		if (version === currentVersion) {
			for (subKey in data) {
				const element = data[subKey];

				if (typeof element === 'string') {
					console.log(element);
				} else {
					console.log(element.title);

					showData(element.data, '');
				}

				if (subKey < data.length) {
					console.log('');
				}
			}

			console.log('</' + langText + '>');

			return;
		}
	}

	throw 'Missing version changelogs for ' + lang;
}

showChangelog('fr', 'fr-FR');
showChangelog('en', 'en-IN');
