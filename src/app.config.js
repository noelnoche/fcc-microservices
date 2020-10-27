const appEnv = process.env.NODE_ENV;
const creds = {};
const server = {};
const endpoints = {};
creds.CX_ID = process.env.CX_ID;
creds.CSE_KEY = process.env.CSE_KEY;

if (appEnv === 'production') {
  server.port = process.env.PORT;
  server.ip = process.env.IP;
  endpoints.MONGO_URI = process.env.MONGO_URI;
  endpoints.SHORT_URI = 'https://ncom.herokuapp.com/url-shortener/';
}
else {
  require('dotenv').config();
  server.port = 3000;
  server.ip = '0.0.0.0';
  endpoints.MONGO_URI = 'mongodb://localhost:27017';
  endpoints.SHORT_URI = 'http://localhost:3000/url-shortener/';
}

module.exports = {
  creds,
  server,
  endpoints
}
