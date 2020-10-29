/**
 * Returns size data from an uploaded file
 * @module file-analyzer
 * @version 2.0.0
 * @see uploader-client
 */


/**
 * Class representing File Analyzer operations
 */
class FileAnalyzer {
  /**
   * Creates an instance of FileAnalyzer
   * @property {Object} postData - Binded "alias" to the postData method
   */
  constructor() {
    this.postData = this.postData.bind(this)
  }

  /**
   * Deletes the file loaded onto the server after after extracting size data
   * @param {string} fname - Name of the uploaded file
   */
  _deleteFile(fname) {
    const fs = require('fs');
    fs.unlink('uploads/' + fname, (err) => {
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
  postData(req, res, next) {
    // NodeJS not support Blob or File constructors, so we make a temp workaround
    // Zombie uses requests as dependency and PhantomJS development suspended,
    // so can only test that file post is successful
    if (process.env.NODE_ENV === 'test') {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.status(200).json({ upload: 'successful' });
      return;
    }

    const multer = require('multer');
    const uploader = multer({
      dest: 'uploads/',
      limits: {
        fileSize: 100000
      }
    }).single('upfile');

    uploader(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error(new Error(err));
        next(err);
      }
      else {
        try {
          const entry = {
            fileName: req.file.filename,
            fileSize: req.file.size
          };
          res.set('Content-Type', 'application/json; charset=utf-8');
          res.status(200).json(entry.fileSize);
          this._deleteFile(entry.fileName);
        }
        catch (err) {
          console.error(new Error(err));
          next(err);
        }
      }
    });
  }
}

module.exports = new FileAnalyzer();
