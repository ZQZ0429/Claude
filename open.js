const { exec } = require('child_process');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
exec(`start "" "${htmlPath}"`, () => process.exit());
