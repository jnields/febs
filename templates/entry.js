// Your js entry point..go!

// Bring in less
require('./entry.less');

const body = document.querySelector('body');
const div = document.createElement('div');
div.innerHTML = "It's go time!";
body.appendChild(div);

