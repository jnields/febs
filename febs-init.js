const path = require('path');
const fs = require('fs-extra');
const projectPath = process.cwd();
const febsPath = path.resolve(__dirname);
const templatesPath = path.resolve(febsPath, 'templates/');

function febsInit() {
  fs.ensureDirSync(path.resolve(projectPath, 'src/'));
  fs.copySync(path.resolve(templatesPath, 'entry.js'), path.resolve(projectPath, 'src/entry.js'))
  fs.copySync(path.resolve(templatesPath, 'entry.less'), path.resolve(projectPath, 'src/entry.less'))
}

module.exports = febsInit;
