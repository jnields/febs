const path = require('path');
const fs = require('fs-extra');

const projectPath = process.cwd();
const templatesPath = path.resolve(__dirname, 'templates/');

module.exports = () => {
  fs.ensureDirSync(path.resolve(projectPath, 'src/'));
  fs.copySync(path.resolve(templatesPath, 'entry.js'), path.resolve(projectPath, 'src/entry.js'));
  fs.copySync(path.resolve(templatesPath, 'entry.less'), path.resolve(projectPath, 'src/entry.less'));
  fs.copySync(path.resolve(templatesPath, 'index.html'), path.resolve(projectPath, 'index.html'));
  fs.copySync(path.resolve(__dirname, '.eslintrc.json'), path.resolve(projectPath, '.eslintrc.json'));
};
