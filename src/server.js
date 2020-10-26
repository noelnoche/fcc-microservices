const config = require('./app.config');

/**
 * The entrypoint of the application, this file holds operations that set up
 * the server and MongoDB database
 * @module server
 * @see module:app-routes
 */

// Required NodeJS and Express modules
const http = require('http');
const compression = require('compression');
const express = require('express');
const app = express();

// Using compression for better performance
app.use(compression());

const appRoutes = require('./app-routes');

const main = (database) => {
  appRoutes.setup(app, express, database);
  
  // Create and run the server after everything is set up
  const server = http.createServer(app);
  const portIp = config.server.port || config.server.ip;
  server.listen(portIp, () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Connection successful: ${portIp}`);
    }
  });
}

// MongoDB and server set up
const MongoServerClient = require('mongodb').MongoClient;

// Create a database variable outside of the database 
// connection callback to reuse the connection pool
let database = null;
const mongoURI = config.endpoints.MONGO_URI;

MongoServerClient.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
  if (err) {
    throw new Error(err)
  }
  else {
    database = client.db('mydb');
    main(database);
  }
});

if (process.env.NODE_ENV === 'test') {
  module.exports = app; 
}