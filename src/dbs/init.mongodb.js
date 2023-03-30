const mongoose = require('mongoose');
const connectString = 'mongodb://localhost:27017/eCommerce';
const { countConnect } = require('../helpers/check.connect');

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    // dev env
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    if (type === 'mongodb') {
      mongoose
        .connect(connectString)
        .then((_) => console.log(`Connected Mongodb Success`, countConnect()))
        .catch((err) => console.log(`Connected Mongodb Failed: ${err}`));
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
