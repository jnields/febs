// Require a modules using non-relative paths ( no ./ or ../ )
const mod1 = require('modules/mod1'); // eslint-disable-line

const key = mod1.somekey;
module.exports = key;
