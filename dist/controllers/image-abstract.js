"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var config = require('../app.config');
/**
 * This module creates an abstraction layer over Google Search Engine
 * @module image-abstract
 */

/**
 * Class representing Image Abstraction Layer operations
 */


var ImageSearch = /*#__PURE__*/function () {
  /**
   * Creates an instance of ImageSearch
   * @property {Object} historyCollection - Image Abstraction Layer database collection
   * @property {Object} projection - Specfies specific fields to return from the database collecton
   * @property {Object} getRecentHistory - Binded Object instance to getRecentHistory method
   * @property {Object} getSearchResults - Binded Object instance to getSearchResults method
   */
  function ImageSearch() {
    _classCallCheck(this, ImageSearch);

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


  _createClass(ImageSearch, [{
    key: "readCollection",
    value: function readCollection(db) {
      var _this = this;

      db.collection('history', {}, function (err, docs) {
        if (err) {
          throw new Error(err);
        } else {
          _this.historyCollection = docs;
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

  }, {
    key: "_saveToHistory",
    value: function _saveToHistory(term) {
      var historyCollection = this.historyCollection;
      var time = new Date();
      var entry = {
        "term": term,
        "when": time.toJSON()
      };
      historyCollection.insertOne(entry, function (err) {
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

  }, {
    key: "getRecentHistory",
    value: function getRecentHistory(req, res, next) {
      // Grab all docs from the history collection, sort with most recent first
      // toArray: returns an array that contains all the documents from a cursor
      // https://mongodb.github.io/node-mongodb-native/3.3/api/CommandCursor.html#toArray
      var historyCollection = this.historyCollection;
      var projection = this.projection;
      historyCollection.find({}, projection).sort({
        when: -1
      }).toArray(function (err, docs) {
        if (err) {
          console.error(new Error(err));
          next(err);
        } else {
          try {
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.status(200).json(docs);
          } catch (err) {
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

  }, {
    key: "getSearchResults",
    value: function getSearchResults(req, res, next) {
      // const request = require('request');
      var axios = require('axios');

      var CSE_KEY = config.creds.CSE_KEY;
      var CX_ID = config.creds.CX_ID;
      var flags = {
        query: req.params[0],
        offset: req.query.offset || 10
      };
      var customSearchURL = "https://www.googleapis.com/customsearch/v1?key=".concat(CSE_KEY, "&cx=").concat(CX_ID, "&q=").concat(flags.query, "&searchType=image&num=").concat(flags.offset); // Data from CSE res object

      this._saveToHistory(flags.query);

      axios.get(customSearchURL).then(function (reqRes) {
        if (reqRes.data.items) {
          // Stores filtered CSE object data
          var fmtRes = []; // Grabbing the fields

          reqRes.data.items.forEach(function (item) {
            var obj = {};
            obj.imageLink = item.link;
            obj.snippet = item.snippet;
            obj.thumbnail = item.image.thumbnailLink;
            obj.siteLink = item.image.contextLink;
            fmtRes.push(obj);
          });
          res.set('Content-Type', 'application/json; charset=utf-8');
          res.status(200).json(fmtRes);
        } else {
          res.status(200).send('No results found.');
        }
      }).catch(function (err) {
        console.error(new Error(err));
        next(err);
      });
    }
  }]);

  return ImageSearch;
}();

module.exports = new ImageSearch();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9pbWFnZS1hYnN0cmFjdC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJyZXF1aXJlIiwiSW1hZ2VTZWFyY2giLCJoaXN0b3J5Q29sbGVjdGlvbiIsInByb2plY3Rpb24iLCJnZXRSZWNlbnRIaXN0b3J5IiwiYmluZCIsImdldFNlYXJjaFJlc3VsdHMiLCJfc2F2ZVRvSGlzdG9yeSIsImRiIiwiY29sbGVjdGlvbiIsImVyciIsImRvY3MiLCJFcnJvciIsInRlcm0iLCJ0aW1lIiwiRGF0ZSIsImVudHJ5IiwidG9KU09OIiwiaW5zZXJ0T25lIiwicmVxIiwicmVzIiwibmV4dCIsImZpbmQiLCJzb3J0Iiwid2hlbiIsInRvQXJyYXkiLCJjb25zb2xlIiwiZXJyb3IiLCJzZXQiLCJzdGF0dXMiLCJqc29uIiwiYXhpb3MiLCJDU0VfS0VZIiwiY3JlZHMiLCJDWF9JRCIsImZsYWdzIiwicXVlcnkiLCJwYXJhbXMiLCJvZmZzZXQiLCJjdXN0b21TZWFyY2hVUkwiLCJnZXQiLCJ0aGVuIiwicmVxUmVzIiwiZGF0YSIsIml0ZW1zIiwiZm10UmVzIiwiZm9yRWFjaCIsIml0ZW0iLCJvYmoiLCJpbWFnZUxpbmsiLCJsaW5rIiwic25pcHBldCIsInRodW1ibmFpbCIsImltYWdlIiwidGh1bWJuYWlsTGluayIsInNpdGVMaW5rIiwiY29udGV4dExpbmsiLCJwdXNoIiwic2VuZCIsImNhdGNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFNQSxNQUFNLEdBQUdDLE9BQU8sQ0FBQyxlQUFELENBQXRCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7SUFDTUMsVztBQUNKO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0UseUJBQWM7QUFBQTs7QUFDWixTQUFLQyxpQkFBTCxHQUF5QixJQUF6QjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLQyxn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QUFYLEVBQWdCQyxJQUFoQixDQUFxQmUsTUFBckI7QUFDRCxTQWhCRCxNQWlCSztBQUNIekIsVUFBQUEsR0FBRyxDQUFDUyxNQUFKLENBQVcsR0FBWCxFQUFnQjZCLElBQWhCLENBQXFCLG1CQUFyQjtBQUNEO0FBQ0YsT0F0QkgsRUF1QkdDLEtBdkJILENBdUJTLFVBQUFqRCxHQUFHLEVBQUk7QUFDWmdCLFFBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLElBQUlmLEtBQUosQ0FBVUYsR0FBVixDQUFkO0FBQ0FXLFFBQUFBLElBQUksQ0FBQ1gsR0FBRCxDQUFKO0FBQ0QsT0ExQkg7QUEyQkQ7Ozs7OztBQUdIa0QsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLElBQUk1RCxXQUFKLEVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY29uZmlnID0gcmVxdWlyZSgnLi4vYXBwLmNvbmZpZycpO1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIGNyZWF0ZXMgYW4gYWJzdHJhY3Rpb24gbGF5ZXIgb3ZlciBHb29nbGUgU2VhcmNoIEVuZ2luZVxuICogQG1vZHVsZSBpbWFnZS1hYnN0cmFjdFxuICovXG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIEltYWdlIEFic3RyYWN0aW9uIExheWVyIG9wZXJhdGlvbnNcbiAqL1xuY2xhc3MgSW1hZ2VTZWFyY2gge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBJbWFnZVNlYXJjaFxuICAgKiBAcHJvcGVydHkge09iamVjdH0gaGlzdG9yeUNvbGxlY3Rpb24gLSBJbWFnZSBBYnN0cmFjdGlvbiBMYXllciBkYXRhYmFzZSBjb2xsZWN0aW9uXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwcm9qZWN0aW9uIC0gU3BlY2ZpZXMgc3BlY2lmaWMgZmllbGRzIHRvIHJldHVybiBmcm9tIHRoZSBkYXRhYmFzZSBjb2xsZWN0b25cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGdldFJlY2VudEhpc3RvcnkgLSBCaW5kZWQgT2JqZWN0IGluc3RhbmNlIHRvIGdldFJlY2VudEhpc3RvcnkgbWV0aG9kXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBnZXRTZWFyY2hSZXN1bHRzIC0gQmluZGVkIE9iamVjdCBpbnN0YW5jZSB0byBnZXRTZWFyY2hSZXN1bHRzIG1ldGhvZFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oaXN0b3J5Q29sbGVjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5wcm9qZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLmdldFJlY2VudEhpc3RvcnkgPSB0aGlzLmdldFJlY2VudEhpc3RvcnkuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFNlYXJjaFJlc3VsdHMgPSB0aGlzLmdldFNlYXJjaFJlc3VsdHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zYXZlVG9IaXN0b3J5ID0gdGhpcy5fc2F2ZVRvSGlzdG9yeS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCBmb3Igc2V0dGluZyB0aGUgY29sbGVjdGlvbiBhbmQgcHJvamVjdGlvbiBmcm9tIHRoZSBNb25nb0RCIGRhdGFiYXNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYiAtIE1vbmdvREIgZGF0YWJhc2VcbiAgICovXG4gIHJlYWRDb2xsZWN0aW9uKGRiKSB7XG4gICAgZGIuY29sbGVjdGlvbignaGlzdG9yeScsIHt9LCAoZXJyLCBkb2NzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuaGlzdG9yeUNvbGxlY3Rpb24gPSBkb2NzO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHRoaXMucHJvamVjdGlvbiA9IHtcbiAgICAgICdfaWQnOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIGZvciBzYXZpbmcgc2VhcmNoIHRlcm0gZGF0YSBpbiB0aGUgc2VhcmNoIGhpc3RvcnkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGVybSAtIFNlYXJjaCB0ZXJtXG4gICAqL1xuICBfc2F2ZVRvSGlzdG9yeSh0ZXJtKSB7XG4gICAgY29uc3QgaGlzdG9yeUNvbGxlY3Rpb24gPSB0aGlzLmhpc3RvcnlDb2xsZWN0aW9uO1xuICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGVudHJ5ID0ge1xuICAgICAgXCJ0ZXJtXCI6IHRlcm0sXG4gICAgICBcIndoZW5cIjogdGltZS50b0pTT04oKVxuICAgIH07XG4gICAgaGlzdG9yeUNvbGxlY3Rpb24uaW5zZXJ0T25lKGVudHJ5LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCBmb3IgcmV0cmVpdmluZyByZWNlbnQgc2VhcmNoIHRlcm1zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXEgLSBSZXF1ZXN0IGZyb20gdGhlIGNsaWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzIC0gUmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBuZXh0IC0gRnVjdGlvbiB0aGF0IGFsbG93cyBFeHByZXNzIHRvIGNhdGNoIGFuZCBwcm9jZXNzIGVycm9yc1xuICAgKi9cbiAgZ2V0UmVjZW50SGlzdG9yeShyZXEsIHJlcywgbmV4dCkge1xuICAgIC8vIEdyYWIgYWxsIGRvY3MgZnJvbSB0aGUgaGlzdG9yeSBjb2xsZWN0aW9uLCBzb3J0IHdpdGggbW9zdCByZWNlbnQgZmlyc3RcbiAgICAvLyB0b0FycmF5OiByZXR1cm5zIGFuIGFycmF5IHRoYXQgY29udGFpbnMgYWxsIHRoZSBkb2N1bWVudHMgZnJvbSBhIGN1cnNvclxuICAgIC8vIGh0dHBzOi8vbW9uZ29kYi5naXRodWIuaW8vbm9kZS1tb25nb2RiLW5hdGl2ZS8zLjMvYXBpL0NvbW1hbmRDdXJzb3IuaHRtbCN0b0FycmF5XG4gICAgY29uc3QgaGlzdG9yeUNvbGxlY3Rpb24gPSB0aGlzLmhpc3RvcnlDb2xsZWN0aW9uO1xuICAgIGNvbnN0IHByb2plY3Rpb24gPSB0aGlzLnByb2plY3Rpb247XG5cbiAgICBoaXN0b3J5Q29sbGVjdGlvbi5maW5kKHt9LCBwcm9qZWN0aW9uKS5zb3J0KHtcbiAgICAgIHdoZW46IC0xXG4gICAgfSkudG9BcnJheSgoZXJyLCBkb2NzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobmV3IEVycm9yKGVycikpO1xuICAgICAgICBuZXh0KGVycik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKGRvY3MpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKG5ldyBFcnJvcihlcnIpKTtcbiAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgZm9yIGNhbGxpbmcgYW5kIHByb2Nlc3NpbmcgaW1hZ2Ugc2VhcmNoIHZpYSBHb29nbGUgQ3VzdG9tIFNlYXJjaCBBUEkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXEgLSBSZXF1ZXN0IGZyb20gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcyAtIFJlc3BvbnNlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG5leHQgLSBGdWN0aW9uIHRoYXQgYWxsb3dzIEV4cHJlc3MgdG8gY2F0Y2ggYW5kIHByb2Nlc3MgZXJyb3JzLlxuICAgKi9cbiAgZ2V0U2VhcmNoUmVzdWx0cyhyZXEsIHJlcywgbmV4dCkge1xuICAgIC8vIGNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XG4gICAgY29uc3QgYXhpb3MgPSByZXF1aXJlKCdheGlvcycpO1xuICAgIGNvbnN0IENTRV9LRVkgPSBjb25maWcuY3JlZHMuQ1NFX0tFWTtcbiAgICBjb25zdCBDWF9JRCA9IGNvbmZpZy5jcmVkcy5DWF9JRDtcbiAgICBjb25zdCBmbGFncyA9IHtcbiAgICAgIHF1ZXJ5OiByZXEucGFyYW1zWzBdLFxuICAgICAgb2Zmc2V0OiByZXEucXVlcnkub2Zmc2V0IHx8IDEwXG4gICAgfTtcbiAgICBjb25zdCBjdXN0b21TZWFyY2hVUkwgPSBgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vY3VzdG9tc2VhcmNoL3YxP2tleT0ke0NTRV9LRVl9JmN4PSR7Q1hfSUR9JnE9JHtmbGFncy5xdWVyeX0mc2VhcmNoVHlwZT1pbWFnZSZudW09JHtmbGFncy5vZmZzZXR9YDtcbiAgXG4gICAgLy8gRGF0YSBmcm9tIENTRSByZXMgb2JqZWN0XG4gICAgdGhpcy5fc2F2ZVRvSGlzdG9yeShmbGFncy5xdWVyeSk7XG5cbiAgICBheGlvcy5nZXQoY3VzdG9tU2VhcmNoVVJMKVxuICAgICAgLnRoZW4ocmVxUmVzID0+IHtcbiAgICAgICAgaWYgKHJlcVJlcy5kYXRhLml0ZW1zKSB7XG4gICAgICAgICAgLy8gU3RvcmVzIGZpbHRlcmVkIENTRSBvYmplY3QgZGF0YVxuICAgICAgICAgIGNvbnN0IGZtdFJlcyA9IFtdO1xuXG4gICAgICAgICAgLy8gR3JhYmJpbmcgdGhlIGZpZWxkc1xuICAgICAgICAgIHJlcVJlcy5kYXRhLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgICAgICAgIG9iai5pbWFnZUxpbmsgPSBpdGVtLmxpbms7XG4gICAgICAgICAgICBvYmouc25pcHBldCA9IGl0ZW0uc25pcHBldDtcbiAgICAgICAgICAgIG9iai50aHVtYm5haWwgPSBpdGVtLmltYWdlLnRodW1ibmFpbExpbms7XG4gICAgICAgICAgICBvYmouc2l0ZUxpbmsgPSBpdGVtLmltYWdlLmNvbnRleHRMaW5rO1xuICAgICAgICAgICAgZm10UmVzLnB1c2gob2JqKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICByZXMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKGZtdFJlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoJ05vIHJlc3VsdHMgZm91bmQuJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihuZXcgRXJyb3IoZXJyKSk7XG4gICAgICAgIG5leHQoZXJyKTtcbiAgICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEltYWdlU2VhcmNoKCk7XG4iXX0=