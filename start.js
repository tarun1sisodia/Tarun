const concurrently = require('concurrently');
const path = require('path');

// Define the commands to run
const commands = [
  {
    command: 'npm run backend',
    name: 'backend',
    prefixColor: 'blue'
  },
  {
    command: 'npm run frontend',
    name: 'frontend',
    prefixColor: 'green'
  }
];

// Options for concurrently
const options = {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
  restartDelay: 1000
};

console.log('Starting BloodConnect development servers...');
console.log('Backend will run on http://localhost:5000');
console.log('Frontend will run on http://localhost:8081');

// Run the commands concurrently
// In newer versions of concurrently, it doesn't return a Promise
concurrently(commands, options);
