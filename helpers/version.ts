const { resolve, relative } = require('path');
const { writeFileSync } = require('fs');
const file = require('find');
const { gitDescribeSync } = require('git-describe');

const { version } = require('./../package.json');

const gitInfo = gitDescribeSync({
  dirtyMark: false,
  dirtySemver: false
});

gitInfo.version = version;

const data = {
  hash: gitInfo.hash,
  version,
  timestamp: new Date().getTime()
};

const fileName = 'version.ts';

const filePaths = file.fileSync(/version\.ts/, './apps');

for (const path of filePaths) {
  writeFileSync(
    path,
    `// AUTO-GENERATED DO NOT CHANGE
    /* tslint:disable */
export const version = ${JSON.stringify(data)};`,
    { encoding: 'utf8' }
  );
  console.log(`Writing version data to ${relative(resolve(__dirname), path)}`);
}
