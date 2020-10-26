const config = require('../app.config');

/**
 * This module creates an abstraction layer over Google Search Engine
 * @module image-abstract
 */

/**
 * Class representing Image Abstraction Layer operations
 */
class ImageSearch {
  /**
   * Creates an instance of ImageSearch
   * @property {Object} historyCollection - Image Abstraction Layer database collection
   * @property {Object} projection - Specfies specific fields to return from the database collecton
   * @property {Object} getRecentHistory - Binded Object instance to getRecentHistory method
   * @property {Object} getSearchResults - Binded Object instance to getSearchResults method
   */
  constructor() {
    this.historyCollection = null;
    this.projection = null;
    this.getRecentHistory = this.getRecentHistory.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this._saveToHistory = this._saveToHistory.bind(this);
  }

  /**
   * Method for setting the collection and projection from the MongoDB database
   * @param {Object} db - MongoDB database
   */
  readCollection(db) {
    db.collection('history', {}, (err, docs) => {
      if (err) {
        throw new Error(err);
      }
      else {
        this.historyCollection = docs;
      }
    });
    
    this.projection = {
      '_id': false
    };
  }

  /**
   * Method for saving search term data in the search history collection
   * @param {string} term - Search term
   */
  _saveToHistory(term) {
    const historyCollection = this.historyCollection;
    const time = new Date();
    const entry = {
      "term": term,
      "when": time.toJSON()
    };
    historyCollection.insertOne(entry, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  }

  /**
   * Method for retreiving recent search terms
   * @param {Object} req - Request from the client
   * @param {Object} res - Response from the server
   * @param {Object} next - Fuction that allows Express to catch and process errors
   */
  getRecentHistory(req, res, next) {
    // Grab all docs from the history collection, sort with most recent first
    // toArray: returns an array that contains all the documents from a cursor
    // https://mongodb.github.io/node-mongodb-native/3.3/api/CommandCursor.html#toArray
    const historyCollection = this.historyCollection;
    const projection = this.projection;

    historyCollection.find({}, projection).sort({
      when: -1
    }).toArray((err, docs) => {
      if (err) {
        console.error(new Error(err));
        next(err);
      }
      else {
        try {
          res.set('Content-Type', 'application/json; charset=utf-8');
          res.status(200).json(docs);
        }
        catch (err) {
          console.error(new Error(err));
          next(err);
        }
      }
    });
  }

  /**
   * Method for calling and processing image search via Google Custom Search API.
   * @param {Object} req - Request from the client.
   * @param {Object} res - Response from the server.
   * @param {Object} next - Fuction that allows Express to catch and process errors.
   */
  getSearchResults(req, res, next) {
    // const request = require('request');
    const axios = require('axios');
    const CSE_KEY = config.creds.CSE_KEY;
    const CX_ID = config.creds.CX_ID;
    const flags = {
      query: req.params[0],
      offset: req.query.offset || 10
    };
    const customSearchURL = `https://www.googleapis.com/customsearch/v1?key=${CSE_KEY}&cx=${CX_ID}&q=${flags.query}&searchType=image&num=${flags.offset}`;
  
    // Data from CSE res object
    this._saveToHistory(flags.query);

    axios.get(customSearchURL)
      .then(reqRes => {
        if (reqRes.data.items) {
          // Stores filtered CSE object data
          const fmtRes = [];

          // Grabbing the fields
          reqRes.data.items.forEach(item => {
            const obj = {};
            obj.imageLink = item.link;
            obj.snippet = item.snippet;
            obj.thumbnail = item.image.thumbnailLink;
            obj.siteLink = item.image.contextLink;
            fmtRes.push(obj);
          });
          
          res.set('Content-Type', 'application/json; charset=utf-8');
          res.status(200).json(fmtRes);
        }
        else {
          res.status(200).send('No results found.');
        }
      })
      .catch(err => {
        console.error(new Error(err));
        next(err);
      });
  }
}

module.exports = new ImageSearch();
