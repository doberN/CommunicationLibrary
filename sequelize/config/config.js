const path = require('path');

module.exports = {
  development: {
   
  },
  test: {
    storage: path.resolve(__dirname, '..', 'data', 'test.db'),
    dialect: 'mysql',
    username: 'root',
    database: 'plugin',
  },
  production: {
   /* storage: path.resolve(__dirname, '..', 'data', 'production.db'),
    dialect: 'mysql',
    logging: false,*/
    "username": USERNAME,
    "password": PASSWORD,
    "database": DATABASE,
    "host": HOST,
    "dialect": "mysql",
  },
};