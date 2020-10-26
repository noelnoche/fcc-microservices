"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var config = require('../app.config');
/**
 * This module takes a URL and shortens it
 * @module url-shortener
 */

/**
 * Class representing URL Shortener operations
 */


var UrlShortener = /*#__PURE__*/function () {
  /**
   * Creates an instance of UrlShortener
   * @property {Object} shrinkCol - URL Shortener database collection
   * @property {Object} projection - Specfies specific fields to return from the database collecton
   * @property {Object} processUrl - Binded Object instance to processUrl method
   * @property {Object} readCollection - Binded Object instance to readCollection method
   * @property {Object} accessLink - Binded Object instance to accessLink method
   */
  function UrlShortener() {
    _classCallCheck(this, UrlShortener);

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


  _createClass(UrlShortener, [{
    key: "readCollection",
    value: function readCollection(db) {
      var _this = this;

      db.collection('shrinkray', {}, function (err, docs) {
        if (err) {
          throw new Error(err);
        } else {
          _this.shrinkCol = docs;
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

  }, {
    key: "processUrl",
    value: function processUrl(req, res, next) {
      var nodeUrl = require('url');

      var validator = require('validator');

      var shrinkCol = this.shrinkCol;
      var projection = this.projection; // Grabs the data that follows * in the index.js file
      // /new/https://www.youtube.com/watch?v=D278XLbp1rE
      // `substring` extracts everyting after /url-shortener/api/v1/new/
      // Be careful when you change the length of the endpoint Url!

      var originalUrl = req.originalUrl.substring(26);
      var urlObj = nodeUrl.parse(originalUrl);

      if (originalUrl === "") {
        res.status(400).send("Error: No original URL provided");
      } else if (urlObj.protocol === null) {
        res.status(400).send("Error: Need to include the URL protocol with double slashes");
      } else if (urlObj.protocol.match(/^https?:$/) && urlObj.slashes && urlObj.host.match(/^(www\.)?[a-z0-9-]{1,63}\.[a-z]{2,}(\.[a-z]{2,})?$/) && validator.isURL(originalUrl) === true) {
        var query = {
          original_url: {
            $eq: encodeURIComponent(originalUrl)
          }
        };
        shrinkCol.findOne(query, projection, function (err, result) {
          if (err) {
            console.error(new Error(err));
            next(new Error(err));
          } else if (result !== null) {
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.status(200).json(result);
          } else {
            var shortid = require('shortid');

            var entry = {}; // Encode user-entered parameters to avoid unexpected requests

            entry.original_url = encodeURIComponent(originalUrl);
            entry.short_url = config.endpoints.SHORT_URI + shortid.generate();
            shrinkCol.insertOne(entry, function (err) {
              if (err) {
                console.error(new Error(err));
                next(err);
              } else {
                try {
                  res.set('Content-Type', 'application/json; charset=utf-8');
                  res.json(entry);
                } catch (err) {
                  console.error(new Error(err));
                  next(err);
                }
              }
            });
          }
        });
      } else {
        res.status(400).send("Error: Invalid URL host address");
      }
    }
    /**
     * Takes the shortened URL and returns the webpage linked to the original URL
     * @param {Object} req - Request from the client
     * @param {Object} res - Response from the server
     * @param {Object} next - Fuction that allows Express to catch and process errors
     */

  }, {
    key: "accessLink",
    value: function accessLink(req, res, next) {
      var shrinkCol = this.shrinkCol;
      var projection = this.projection;
      var query = {};
      query.short_url = {
        $eq: config.endpoints.SHORT_URI + req.params.data
      };
      shrinkCol.findOne(query, projection, function (err, result) {
        if (err) {
          console.error(new Error(err));
          next(err);
        } else if (result !== null) {
          // Don't forget to decode the url!
          var url = decodeURIComponent(result.original_url);
          res.redirect(url);
        } else {
          next('Error: The entered URL is incorrect or has expired');
        }
      });
    }
  }]);

  return UrlShortener;
}();

module.exports = new UrlShortener();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy91cmwtc2hvcnRlbmVyLmpzIl0sIm5hbWVzIjpbImNvbmZpZyIsInJlcXVpcmUiLCJVcmxTaG9ydGVuZXIiLCJzaHJpbmtDb2wiLCJwcm9qZWN0aW9uIiwicHJvY2Vzc1VybCIsImJpbmQiLCJyZWFkQ29sbGVjdGlvbiIsImFjY2Vzc0xpbmsiLCJkYiIsImNvbGxlY3Rpb24iLCJlcnIiLCJkb2NzIiwiRXJyb3IiLCJyZXEiLCJyZXMiLCJuZXh0Iiwibm9kZVVybCIsInZhbGlkYXRvciIsIm9yaWdpbmFsVXJsIiwic3Vic3RyaW5nIiwidXJsT2JqIiwicGFyc2UiLCJzdGF0dXMiLCJzZW5kIiwicHJvdG9jb2wiLCJtYXRjaCIsInNsYXNoZXMiLCJob3N0IiwiaXNVUkwiLCJxdWVyeSIsIm9yaWdpbmFsX3VybCIsIiRlcSIsImVuY29kZVVSSUNvbXBvbmVudCIsImZpbmRPbmUiLCJyZXN1bHQiLCJjb25zb2xlIiwiZXJyb3IiLCJzZXQiLCJqc29uIiwic2hvcnRpZCIsImVudHJ5Iiwic2hvcnRfdXJsIiwiZW5kcG9pbnRzIiwiU0hPUlRfVVJJIiwiZ2VuZXJhdGUiLCJpbnNlcnRPbmUiLCJwYXJhbXMiLCJkYXRhIiwidXJsIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwicmVkaXJlY3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU1BLE1BQU0sR0FBR0MsT0FBTyxDQUFDLGVBQUQsQ0FBdEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztJQUNNQyxZO0FBQ0o7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLDBCQUFjO0FBQUE7O0FBQ1osU0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEtBQUtBLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCLElBQXJCLENB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QUEsTUFBQUEsS0FBSyxDQUFDWSxTQUFOLEdBQWtCO0FBQUVWLFFBQUFBLEdBQUcsRUFBRWhDLE1BQU0sQ0FBQzJDLFNBQVAsQ0FBaUJDLFNBQWpCLEdBQTZCOUIsR0FBRyxDQUFDaUMsTUFBSixDQUFXQztBQUEvQyxPQUFsQjtBQUVBN0MsTUFBQUEsU0FBUyxDQUFDK0IsT0FBVixDQUFrQkosS0FBbEIsRUFBeUIxQixVQUF6QixFQUFxQyxVQUFVTyxHQUFWLEVBQWV3QixNQUFmLEVBQXVCO0FBQzFELFlBQUl4QixHQUFKLEVBQVM7QUFDUHlCLFVBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLElBQUl4QixLQUFKLENBQVVGLEdBQVYsQ0FBZDtBQUNBSyxVQUFBQSxJQUFJLENBQUNMLEdBQUQsQ0FBSjtBQUNELFNBSEQsTUFJSyxJQUFJd0IsTUFBTSxLQUFLLElBQWYsRUFBcUI7QUFDeEI7QUFDQSxjQUFNYyxHQUFHLEdBQUdDLGtCQUFrQixDQUFDZixNQUFNLENBQUNKLFlBQVIsQ0FBOUI7QUFDQWhCLFVBQUFBLEdBQUcsQ0FBQ29DLFFBQUosQ0FBYUYsR0FBYjtBQUNELFNBSkksTUFLQTtBQUNIakMsVUFBQUEsSUFBSSxDQUFDLG9EQUFELENBQUo7QUFDRDtBQUNGLE9BYkQ7QUFjRDs7Ozs7O0FBR0hvQyxNQUFNLENBQUNDLE9BQVAsR0FBaUIsSUFBSW5ELFlBQUosRUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjb25maWcgPSByZXF1aXJlKCcuLi9hcHAuY29uZmlnJyk7XG5cbi8qKlxuICogVGhpcyBtb2R1bGUgdGFrZXMgYSBVUkwgYW5kIHNob3J0ZW5zIGl0XG4gKiBAbW9kdWxlIHVybC1zaG9ydGVuZXJcbiAqL1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBVUkwgU2hvcnRlbmVyIG9wZXJhdGlvbnNcbiAqL1xuY2xhc3MgVXJsU2hvcnRlbmVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgVXJsU2hvcnRlbmVyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzaHJpbmtDb2wgLSBVUkwgU2hvcnRlbmVyIGRhdGFiYXNlIGNvbGxlY3Rpb25cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHByb2plY3Rpb24gLSBTcGVjZmllcyBzcGVjaWZpYyBmaWVsZHMgdG8gcmV0dXJuIGZyb20gdGhlIGRhdGFiYXNlIGNvbGxlY3RvblxuICAgKiBAcHJvcGVydHkge09iamVjdH0gcHJvY2Vzc1VybCAtIEJpbmRlZCBPYmplY3QgaW5zdGFuY2UgdG8gcHJvY2Vzc1VybCBtZXRob2RcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHJlYWRDb2xsZWN0aW9uIC0gQmluZGVkIE9iamVjdCBpbnN0YW5jZSB0byByZWFkQ29sbGVjdGlvbiBtZXRob2RcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGFjY2Vzc0xpbmsgLSBCaW5kZWQgT2JqZWN0IGluc3RhbmNlIHRvIGFjY2Vzc0xpbmsgbWV0aG9kXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNocmlua0NvbCA9IG51bGw7XG4gICAgdGhpcy5wcm9qZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLnByb2Nlc3NVcmwgPSB0aGlzLnByb2Nlc3NVcmwuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlYWRDb2xsZWN0aW9uID0gdGhpcy5yZWFkQ29sbGVjdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWNjZXNzTGluayA9IHRoaXMuYWNjZXNzTGluay5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgdGhlIGNvbGxlY3Rpb24gYW5kIHByb2plY3Rpb24gZnJvbSB0aGUgTW9uZ29EQiBkYXRhYmFzZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGIgLSBNb25nb0RCIGRhdGFiYXNlXG4gICAqL1xuICByZWFkQ29sbGVjdGlvbihkYikge1xuICAgIGRiLmNvbGxlY3Rpb24oJ3Nocmlua3JheScsIHt9LCAoZXJyLCBkb2NzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuc2hyaW5rQ29sID0gZG9jcztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucHJvamVjdGlvbiA9IHtcbiAgICAgICdfaWQnOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSBuZXcgVVJMIGFuZCBwcm9jZXNzZXMgaXQgaW50byB0aGUgZGF0YWJhc2UgY29sbGVjdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxIC0gUmVxdWVzdCBmcm9tIHRoZSBjbGllbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcyAtIFJlc3BvbnNlIGZyb20gdGhlIHNlcnZlclxuICAgKiBAcGFyYW0ge09iamVjdH0gbmV4dCAtIEZ1Y3Rpb24gdGhhdCBhbGxvd3MgRXhwcmVzcyB0byBjYXRjaCBhbmQgcHJvY2VzcyBlcnJvcnNcbiAgICovXG4gIHByb2Nlc3NVcmwocmVxLCByZXMsIG5leHQpIHtcbiAgICBjb25zdCBub2RlVXJsID0gcmVxdWlyZSgndXJsJyk7XG4gICAgY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZSgndmFsaWRhdG9yJyk7XG4gICAgY29uc3Qgc2hyaW5rQ29sID0gdGhpcy5zaHJpbmtDb2w7XG4gICAgY29uc3QgcHJvamVjdGlvbiA9IHRoaXMucHJvamVjdGlvbjtcbiAgICBcbiAgICAvLyBHcmFicyB0aGUgZGF0YSB0aGF0IGZvbGxvd3MgKiBpbiB0aGUgaW5kZXguanMgZmlsZVxuICAgIC8vIC9uZXcvaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1EMjc4WExicDFyRVxuICAgIC8vIGBzdWJzdHJpbmdgIGV4dHJhY3RzIGV2ZXJ5dGluZyBhZnRlciAvdXJsLXNob3J0ZW5lci9hcGkvdjEvbmV3L1xuICAgIC8vIEJlIGNhcmVmdWwgd2hlbiB5b3UgY2hhbmdlIHRoZSBsZW5ndGggb2YgdGhlIGVuZHBvaW50IFVybCFcbiAgICBjb25zdCBvcmlnaW5hbFVybCA9IHJlcS5vcmlnaW5hbFVybC5zdWJzdHJpbmcoMjYpO1xuICAgIGNvbnN0IHVybE9iaiA9IG5vZGVVcmwucGFyc2Uob3JpZ2luYWxVcmwpO1xuXG4gICAgaWYgKG9yaWdpbmFsVXJsID09PSBcIlwiKSB7XG4gICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZChcIkVycm9yOiBObyBvcmlnaW5hbCBVUkwgcHJvdmlkZWRcIik7XG4gICAgfVxuICAgIGVsc2UgaWYgKHVybE9iai5wcm90b2NvbCA9PT0gbnVsbCkge1xuICAgICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoXCJFcnJvcjogTmVlZCB0byBpbmNsdWRlIHRoZSBVUkwgcHJvdG9jb2wgd2l0aCBkb3VibGUgc2xhc2hlc1wiKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodXJsT2JqLnByb3RvY29sLm1hdGNoKC9eaHR0cHM/OiQvKSAmJiB1cmxPYmouc2xhc2hlcyBcbiAgICAgICYmIHVybE9iai5ob3N0Lm1hdGNoKC9eKHd3d1xcLik/W2EtejAtOS1dezEsNjN9XFwuW2Etel17Mix9KFxcLlthLXpdezIsfSk/JC8pIFxuICAgICAgJiYgdmFsaWRhdG9yLmlzVVJMKG9yaWdpbmFsVXJsKSA9PT0gdHJ1ZSkge1xuICAgICAgXG4gICAgICBjb25zdCBxdWVyeSA9IHtcbiAgICAgICAgb3JpZ2luYWxfdXJsOiB7XG4gICAgICAgICAgJGVxOiBlbmNvZGVVUklDb21wb25lbnQob3JpZ2luYWxVcmwpXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNocmlua0NvbC5maW5kT25lKHF1ZXJ5LCBwcm9qZWN0aW9uLCAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IobmV3IEVycm9yKGVycikpO1xuICAgICAgICAgIG5leHQobmV3IEVycm9yKGVycikpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjb25zdCBzaG9ydGlkID0gcmVxdWlyZSgnc2hvcnRpZCcpO1xuICAgICAgICAgIGNvbnN0IGVudHJ5ID0ge307XG5cbiAgICAgICAgICAvLyBFbmNvZGUgdXNlci1lbnRlcmVkIHBhcmFtZXRlcnMgdG8gYXZvaWQgdW5leHBlY3RlZCByZXF1ZXN0c1xuICAgICAgICAgIGVudHJ5Lm9yaWdpbmFsX3VybCA9IGVuY29kZVVSSUNvbXBvbmVudChvcmlnaW5hbFVybCk7XG4gICAgICAgICAgZW50cnkuc2hvcnRfdXJsID0gY29uZmlnLmVuZHBvaW50cy5TSE9SVF9VUkkgKyBzaG9ydGlkLmdlbmVyYXRlKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgc2hyaW5rQ29sLmluc2VydE9uZShlbnRyeSwgKGVycikgPT4geyAgICBcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihuZXcgRXJyb3IoZXJyKSk7XG4gICAgICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICAgICAgICAgICAgcmVzLmpzb24oZW50cnkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKG5ldyBFcnJvcihlcnIpKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gICAgICAgIFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IFxuICAgIGVsc2Uge1xuICAgICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoXCJFcnJvcjogSW52YWxpZCBVUkwgaG9zdCBhZGRyZXNzXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyB0aGUgc2hvcnRlbmVkIFVSTCBhbmQgcmV0dXJucyB0aGUgd2VicGFnZSBsaW5rZWQgdG8gdGhlIG9yaWdpbmFsIFVSTFxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxIC0gUmVxdWVzdCBmcm9tIHRoZSBjbGllbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcyAtIFJlc3BvbnNlIGZyb20gdGhlIHNlcnZlclxuICAgKiBAcGFyYW0ge09iamVjdH0gbmV4dCAtIEZ1Y3Rpb24gdGhhdCBhbGxvd3MgRXhwcmVzcyB0byBjYXRjaCBhbmQgcHJvY2VzcyBlcnJvcnNcbiAgICovXG4gIGFjY2Vzc0xpbmsocmVxLCByZXMsIG5leHQpIHtcbiAgICBjb25zdCBzaHJpbmtDb2wgPSB0aGlzLnNocmlua0NvbDtcbiAgICBjb25zdCBwcm9qZWN0aW9uID0gdGhpcy5wcm9qZWN0aW9uO1xuICAgIGNvbnN0IHF1ZXJ5ID0ge307XG4gICAgXG4gICAgcXVlcnkuc2hvcnRfdXJsID0geyAkZXE6IGNvbmZpZy5lbmRwb2ludHMuU0hPUlRfVVJJICsgcmVxLnBhcmFtcy5kYXRhIH07XG5cbiAgICBzaHJpbmtDb2wuZmluZE9uZShxdWVyeSwgcHJvamVjdGlvbiwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobmV3IEVycm9yKGVycikpO1xuICAgICAgICBuZXh0KGVycik7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgLy8gRG9uJ3QgZm9yZ2V0IHRvIGRlY29kZSB0aGUgdXJsIVxuICAgICAgICBjb25zdCB1cmwgPSBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0Lm9yaWdpbmFsX3VybCk7XG4gICAgICAgIHJlcy5yZWRpcmVjdCh1cmwpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG5leHQoJ0Vycm9yOiBUaGUgZW50ZXJlZCBVUkwgaXMgaW5jb3JyZWN0IG9yIGhhcyBleHBpcmVkJyk7XG4gICAgICB9XG4gICAgfSk7ICAgICAgXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVXJsU2hvcnRlbmVyKCk7XG4iXX0=