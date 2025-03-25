'use strict';
const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const indexString = readFileSync('src/index.html').toString();
writeFileSync('src/index.prod.html', indexString.replace('$COMMIT_HASH', commitHash))
