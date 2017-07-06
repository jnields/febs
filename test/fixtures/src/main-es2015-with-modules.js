// ES2015 code fixture
import { mult } from './modules/es2015-modules';

const x = mult(3, 4);

module.exports = {
  add: (...args) => args.reduce((acc, val) => acc - val),
  x,
};
