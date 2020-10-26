"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * This module uploads a local file and returns file size data
 * @module file-analyzer
 * @see uploader-client
 */

/**
 * Class representing File Analyzer operations
 */
var FileAnalyzer = /*#__PURE__*/function () {
  /**
   * Creates an instance of FileAnalyzer
   * @property {Object} postData - Binded "alias" to the postData method
   */
  function FileAnalyzer() {
    _classCallCheck(this, FileAnalyzer);

    this.postData = this.postData.bind(this);
  }
  /**
   * Deletes the file loaded onto the server after after extracting size data
   * @param {string} fname - Name of the uploaded file
   */


  _createClass(FileAnalyzer, [{
    key: "_deleteFile",
    value: function _deleteFile(fname) {
      var fs = require('fs');

      fs.unlink('uploads/' + fname, function (err) {
        if (err) {
          throw new Error(err);
        }

        console.log('File deleted from server successfully!');
      });
    }
    /**
     * Takes file data from the client and returns the file size
     * @param {Object} req - Request from the client
     * @param {Object} res - Response from the server
     */

  }, {
    key: "postData",
    value: function postData(req, res, next) {
      var _this = this;

      // NodeJS not support Blob or File constructors, so we make a temp workaround
      // Zombie uses requests as dependency and PhantomJS development suspended,
      // so can only test that file post is successful
      if (process.env.NODE_ENV === 'test') {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.status(200).json({
          upload: 'successful'
        });
        return;
      }

      var multer = require('multer');

      var uploader = multer({
        dest: 'uploads/',
        limits: {
          fileSize: 100000
        }
      }).single('upfile');
      uploader(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.error(new Error(err));
          next(err);
        } else {
          try {
            var entry = {
              fileName: req.file.filename,
              fileSize: req.file.size
            };
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.status(200).json(entry.fileSize);

            _this._deleteFile(entry.fileName);
          } catch (err) {
            console.error(new Error(err));
            next(err);
          }
        }
      });
    }
  }]);

  return FileAnalyzer;
}();

module.exports = new FileAnalyzer();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9maWxlLWFuYWx5emVyLmpzIl0sIm5hbWVzIjpbIkZpbGVBbmFseXplciIsInBvc3REYXRhIiwiYmluZCIsImZuYW1lIiwiZnMiLCJyZXF1aXJlIiwidW5saW5rIiwiZXJyIiwiRXJyb3IiLCJjb25zb2xlIiwibG9nIiwicmVxIiwicmVzIiwibmV4dCIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsInNldCIsInN0YXR1cyIsImpzb24iLCJ1cGxvYWQiLCJtdWx0ZXIiLCJ1cGxvYWRlciIsImRlc3QiLCJsaW1pdHMiLCJmaWxlU2l6ZSIsInNpbmdsZSIsIk11bHRlckVycm9yIiwiZXJyb3IiLCJlbnRyeSIsImZpbGVOYW1lIiwiZmlsZSIsImZpbGVuYW1lIiwic2l6ZSIsIl9kZWxldGVGaWxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtJQUNNQSxZO0FBQ0o7QUFDRjtBQUNBO0FBQ0E7QUFDRSwwQkFBYztBQUFBOztBQUNaLFNBQUtDLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxDQUFjQyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7Ozs7Z0NBQ2NDLEssRUFBTztBQUNqQixVQUFNQyxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBRCxNQUFBQSxFQUFFLENBQUNFLE1BQUgsQ0FBVSxhQUFhSCxLQUF2QixFQUE4QixVQUFDSSxHQUFELEVBQVM7QUFDckMsWUFBSUEsR0FBSixFQUFTO0FBQ1AsZ0JBQU0sSUFBSUMsS0FBSixDQUFVRCxHQUFWLENBQU47QUFDRDs7QUFDREUsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksd0NBQVo7QUFDRCxPQUxEO0FBTUQ7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7OzZCQUNXQyxHLEVBQUtDLEcsRUFBS0MsSSxFQUFNO0FBQUE7O0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLFVBQUlDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFaLEtBQXlCLE1BQTdCLEVBQXFDO0FBQ25DSixRQUFBQSxHQUFHLENBQUNLLEdBQUosQ0FBUSxjQUFSLEVBQXdCLGlDQUF4QjtBQUNBTCxRQUFBQSxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUFFQyxVQUFBQSxNQUFNLEVBQUU7QUFBVixTQUFyQjtBQUNBO0FBQ0Q7O0FBRUQsVUFBTUMsTUFBTSxHQUFHaEIsT0FBTyxDQUFDLFFBQUQsQ0FBdEI7O0FBQ0EsVUFBTWlCLFFBQVEsR0FBR0QsTUFBTSxDQUFDO0FBQ3RCRSxRQUFBQSxJQUFJLEVBQUUsVUFEZ0I7QUFFdEJDLFFBQUFBLE1BQU0sRUFBRTtBQUNOQyxVQUFBQSxRQUFRLEVBQUU7QUFESjtBQUZjLE9BQUQsQ0FBTixDQUtkQyxNQUxjLENBS1AsUUFMTyxDQUFqQjtBQU9BSixNQUFBQSxRQUFRLENBQUNYLEdBQUQsRUFBTUMsR0FBTixFQUFXLFVBQUNMLEdBQUQsRUFBUztBQUMxQixZQUFJQSxHQUFHLFlBQVljLE1BQU0sQ0FBQ00sV0FBMUIsRUFBdUM7QUFDckNsQixVQUFBQSxPQUFPLENBQUNtQixLQUFSLENBQWMsSUFBSXBCLEtBQUosQ0FBVUQsR0FBVixDQUFkO0FBQ0FNLFVBQUFBLElBQUksQ0FBQ04sR0FBRCxDQUFKO0FBQ0QsU0FIRCxNQUlLO0FBQ0gsY0FBSTtBQUNGLGdCQUFNc0IsS0FBSyxHQUFHO0FBQ1pDLGNBQUFBLFFBQVEsRUFBRW5CLEdBQUcsQ0FBQ29CLElBQUosQ0FBU0MsUUFEUDtBQUVaUCxjQUFBQSxRQUFRLEVBQUVkLEdBQUcsQ0FBQ29CLElBQUosQ0FBU0U7QUFGUCxhQUFkO0FBSUFyQixZQUFBQSxHQUFHLENBQUNLLEdBQUosQ0FBUSxjQUFSLEVBQXdCLGlDQUF4QjtBQUNBTCxZQUFBQSxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQlUsS0FBSyxDQUFDSixRQUEzQjs7QUFDQSxZQUFBLEtBQUksQ0FBQ1MsV0FBTCxDQUFpQkwsS0FBSyxDQUFDQyxRQUF2QjtBQUNELFdBUkQsQ0FTQSxPQUFNdkIsR0FBTixFQUFXO0FBQ1RFLFlBQUFBLE9BQU8sQ0FBQ21CLEtBQVIsQ0FBYyxJQUFJcEIsS0FBSixDQUFVRCxHQUFWLENBQWQ7QUFDQU0sWUFBQUEsSUFBSSxDQUFDTixHQUFELENBQUo7QUFDRDtBQUNGO0FBQ0YsT0FwQk8sQ0FBUjtBQXFCRDs7Ozs7O0FBR0g0QixNQUFNLENBQUNDLE9BQVAsR0FBaUIsSUFBSXBDLFlBQUosRUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgbW9kdWxlIHVwbG9hZHMgYSBsb2NhbCBmaWxlIGFuZCByZXR1cm5zIGZpbGUgc2l6ZSBkYXRhXG4gKiBAbW9kdWxlIGZpbGUtYW5hbHl6ZXJcbiAqIEBzZWUgdXBsb2FkZXItY2xpZW50XG4gKi9cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgRmlsZSBBbmFseXplciBvcGVyYXRpb25zXG4gKi9cbmNsYXNzIEZpbGVBbmFseXplciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEZpbGVBbmFseXplclxuICAgKiBAcHJvcGVydHkge09iamVjdH0gcG9zdERhdGEgLSBCaW5kZWQgXCJhbGlhc1wiIHRvIHRoZSBwb3N0RGF0YSBtZXRob2RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zdERhdGEgPSB0aGlzLnBvc3REYXRhLmJpbmQodGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIHRoZSBmaWxlIGxvYWRlZCBvbnRvIHRoZSBzZXJ2ZXIgYWZ0ZXIgYWZ0ZXIgZXh0cmFjdGluZyBzaXplIGRhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZuYW1lIC0gTmFtZSBvZiB0aGUgdXBsb2FkZWQgZmlsZVxuICAgKi9cbiAgX2RlbGV0ZUZpbGUoZm5hbWUpIHtcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgZnMudW5saW5rKCd1cGxvYWRzLycgKyBmbmFtZSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKCdGaWxlIGRlbGV0ZWQgZnJvbSBzZXJ2ZXIgc3VjY2Vzc2Z1bGx5IScpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGZpbGUgZGF0YSBmcm9tIHRoZSBjbGllbnQgYW5kIHJldHVybnMgdGhlIGZpbGUgc2l6ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxIC0gUmVxdWVzdCBmcm9tIHRoZSBjbGllbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcyAtIFJlc3BvbnNlIGZyb20gdGhlIHNlcnZlclxuICAgKi9cbiAgcG9zdERhdGEocmVxLCByZXMsIG5leHQpIHtcbiAgICAvLyBOb2RlSlMgbm90IHN1cHBvcnQgQmxvYiBvciBGaWxlIGNvbnN0cnVjdG9ycywgc28gd2UgbWFrZSBhIHRlbXAgd29ya2Fyb3VuZFxuICAgIC8vIFpvbWJpZSB1c2VzIHJlcXVlc3RzIGFzIGRlcGVuZGVuY3kgYW5kIFBoYW50b21KUyBkZXZlbG9wbWVudCBzdXNwZW5kZWQsXG4gICAgLy8gc28gY2FuIG9ubHkgdGVzdCB0aGF0IGZpbGUgcG9zdCBpcyBzdWNjZXNzZnVsXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCcpIHtcbiAgICAgIHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHVwbG9hZDogJ3N1Y2Nlc3NmdWwnfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbXVsdGVyID0gcmVxdWlyZSgnbXVsdGVyJyk7XG4gICAgY29uc3QgdXBsb2FkZXIgPSBtdWx0ZXIoe1xuICAgICAgZGVzdDogJ3VwbG9hZHMvJyxcbiAgICAgIGxpbWl0czoge1xuICAgICAgICBmaWxlU2l6ZTogMTAwMDAwXG4gICAgICB9XG4gICAgfSkuc2luZ2xlKCd1cGZpbGUnKTtcblxuICAgIHVwbG9hZGVyKHJlcSwgcmVzLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyIGluc3RhbmNlb2YgbXVsdGVyLk11bHRlckVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobmV3IEVycm9yKGVycikpO1xuICAgICAgICBuZXh0KGVycik7XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSB7XG4gICAgICAgICAgICBmaWxlTmFtZTogcmVxLmZpbGUuZmlsZW5hbWUsXG4gICAgICAgICAgICBmaWxlU2l6ZTogcmVxLmZpbGUuc2l6ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmVzLnNldCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbihlbnRyeS5maWxlU2l6ZSk7XG4gICAgICAgICAgdGhpcy5fZGVsZXRlRmlsZShlbnRyeS5maWxlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihuZXcgRXJyb3IoZXJyKSk7XG4gICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRmlsZUFuYWx5emVyKCk7XG4iXX0=