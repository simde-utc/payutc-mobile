const fs = require('fs');

console.log(`v${JSON.parse(fs.readFileSync('app.json', 'utf8')).expo.version}`);
