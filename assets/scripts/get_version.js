const fs = require('fs');

const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
const code = appJson.versionCode;
const name = appJson.versionName;

switch (process.argv[2]) {
	case 'code':
		console.log(code);
		break;

	case 'name':
		console.log(name);
		break;

	case 'fullname':
	default:
		console.log(`v${name}`);
		break;
}
