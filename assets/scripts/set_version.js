const fs = require('fs');
const replace = require('replace-in-file');

if (process.argv.length < 3) {
	throw 'Need version argument';
}

const appJson = fs.readFileSync('app.json', 'utf8');

const newVersion = process.argv[2].slice(process.argv[2][0] === 'v');
const currentVersionCode = JSON.parse(appJson).versionCode;
const currentVersionName = JSON.parse(appJson).versionName;

replace({
	files: 'app.json',
	from: /"versionCode": \d+/,
	to: `"versionCode": ${currentVersionCode + 1}`,
}).then(() => {
	replace({
		files: 'app.json',
		from: /"versionName": "[0-9a-zA-Z._-]+"/,
		to: `"versionName": "${newVersion}"`,
	}).then(() => {
		replace({
			files: 'app.json',
			from: /"version": \d+/,
			to: `"version": ${currentVersionCode + 1}`,
		});
	});
});

replace({
	files: 'android/build.gradle',
	from: /versionCode = \d+/,
	to: `versionCode = ${currentVersionCode + 1}`,
}).then(() => {
	replace({
		files: 'android/build.gradle',
		from: /versionName = "[0-9a-zA-Z._-]+"/,
		to: `versionName = "${newVersion}"`,
	});
});

replace({
	files: 'ios/PayUTC/Info.plist',
	from: /<key>CFBundleVersion<\/key><string>\d+<\/string>/,
	to: `<key>CFBundleVersion</key><string>${currentVersionCode + 1}</string>`,
}).then(() => {
	replace({
		files: 'ios/PayUTC/Info.plist',
		from: /<key>CFBundleShortVersionString<\/key><string>[0-9a-zA-Z._-]+<\/string>/,
		to: `<key>CFBundleShortVersionString</key><string>${newVersion}</string>`,
	});
});
