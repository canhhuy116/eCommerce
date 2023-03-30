const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;
// count connection
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCpu = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on the number of CPU cores
    const maxConnection = numCpu * 5;

    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection >= maxConnection) {
      console.log(`Overload: ${numConnection} connections`);
      // Example: send email to admin
    } else {
      console.log(`Normal: ${numConnection} connections`);
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = { countConnect, checkOverLoad };
