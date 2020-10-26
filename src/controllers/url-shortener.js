const config = require('../app.config');

/**
 * This module takes a URL and shortens it
 * @module url-shortener
 */

/**
 * Class representing URL Shortener operations
 */
class UrlShortener {
  /**
   * Creates an instance of UrlShortener
   * @property {Object} shrinkCol - URL Shortener database collection
   * @property {Object} projection - Specfies specific fields to return from the database collecton
   * @property {Object} processUrl - Binded Object instance to processUrl method
   * @property {Object} readCollection - Binded Object instance to readCollection method
   * @property {Object} accessLink - Binded Object instance to accessLink method
   */
  constructor() {
    this.shrinkCol = null;
    this.projection = null;
    this.processUrl = this.processUrl.bind(this);
    this.readCollection = this.readCollection.bind(this);
    this.accessLink = this.accessLink.bind(this);
  }

  /**
   * This method sets the collection and projection from the MongoDB database
   * @param {Object} db - MongoDB database
   */
  readCollection(db) {
    db.collection('shrinkray', {}, (err, docs) => {
      if (err) {
        throw new Error(err);
      }
      else {
        this.shrinkCol = docs;
      }
    });

    this.projection = {
      '_id': false
    };
  }

  /**
   * Takes a new URL and processes it into the database collection
   * @param {Object} req - Request from the client
   * @param {Object} res - Response from the server
   * @param {Object} next - Fuction that allows Express to catch and process errors
   */
  processUrl(req, res, next) {
    const nodeUrl = require('url');
    const validator = require('validator');
    const shrinkCol = this.shrinkCol;
    const projection = this.projection;
    
    // Grabs the data that follows * in the index.js file
    // /new/https://www.youtube.com/watch?v=D278XLbp1rE
    // `substring` extracts everyting after /url-shortener/api/v1/new/
    // Be careful when you change the length of the endpoint Url!
    const originalUrl = req.originalUrl.substring(26);
    const urlObj = nodeUrl.parse(originalUrl);

    if (originalUrl === "") {
      res.status(400).send("Error: No original URL provided");
    }
    else if (urlObj.protocol === null) {
      res.status(400).send("Error: Need to include the URL protocol with double slashes");
    }
    else if (urlObj.protocol.match(/^https?:$/) && urlObj.slashes 
      && urlObj.host.match(/^(www\.)?[a-z0-9-]{1,63}\.[a-z]{2,}(\.[a-z]{2,})?$/) 
      && validator.isURL(originalUrl) === true) {
      
      const query = {
        original_url: {
          $eq: encodeURIComponent(originalUrl)
        }
      };

      shrinkCol.findOne(query, projection, (err, result) => {
        if (err) {
          console.error(new Error(err));
          next(new Error(err));
        }
        else if (result !== null) {
          res.set('Content-Type', 'application/json; charset=utf-8');
          res.status(200).json(result);
        }
        else {
          const shortid = require('shortid');
          const entry = {};

          // Encode user-entered parameters to avoid unexpected requests
          entry.original_url = encodeURIComponent(originalUrl);
          entry.short_url = config.endpoints.SHORT_URI + shortid.generate();
          
          shrinkCol.insertOne(entry, (err) => {    
            if (err) {
              console.error(new Error(err));
              next(err);
            }
            else {
              try {
                res.set('Content-Type', 'application/json; charset=utf-8');
                res.json(entry);
              }
              catch (err) {
                console.error(new Error(err));
                next(err);
              }
            }        
          });
        }
      });
    } 
    else {
      res.status(400).send("Error: Invalid URL host address");
    }
  }

  /**
   * Takes the shortened URL and returns the webpage linked to the original URL
   * @param {Object} req - Request from the client
   * @param {Object} res - Response from the server
   * @param {Object} next - Fuction that allows Express to catch and process errors
   */
  accessLink(req, res, next) {
    const shrinkCol = this.shrinkCol;
    const projection = this.projection;
    const query = {};
    
    query.short_url = { $eq: config.endpoints.SHORT_URI + req.params.data };

    shrinkCol.findOne(query, projection, function (err, result) {
      if (err) {
        console.error(new Error(err));
        next(err);
      }
      else if (result !== null) {
        // Don't forget to decode the url!
        const url = decodeURIComponent(result.original_url);
        res.redirect(url);
      }
      else {
        next('Error: The entered URL is incorrect or has expired');
      }
    });      
  }
}

module.exports = new UrlShortener();
