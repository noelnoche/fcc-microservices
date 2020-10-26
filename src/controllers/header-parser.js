/** @module header-parser */

/**
 * Request header parser application URL handler
 * @function parseRequest
 * @param {object} req - Request from the client
 * @param {object} res - Response from the server
 */
const parseRequest = (req, res, next) => {
  const ipAddr = req.ip || req.connection.remoteAddress || null;
  const lang = req.get('Accept-Language') || null;
  const usrAgent = req.get('User-Agent') || null;

  const dataObj = {
    ip: ipAddr,
    lang: lang,
    agent: usrAgent
  };

  try {
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(dataObj);
  }
  catch (err) {
    console.error(new Error(err));
    next(err);
  }
}

module.exports = parseRequest;
