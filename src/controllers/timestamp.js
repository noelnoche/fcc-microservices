/**
 * Takes a human-readable date and returns it in UNIX time format and vice versa
 * @module timestamp
 * @version 2.0.0
 */

/**
 * Timestamp mircoservice handler
 * @function timestamp
 * @param {object} req - Request from the client
 * @param {object} res - Response from the server
 */
const getTimestamp = (req, res, next) => {
  const monthsArray = Object.freeze(['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  const dataObj = { "unix": null, "natural": null };
  const usrInput = req.params.data;
  let convTime = null;

  // From Unix to natural
  if (usrInput.match(/^[0-9]+$/)) {
    const dateObj = new Date(parseInt(usrInput, 10));
    const month = dateObj.getMonth();
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    convTime = `${monthsArray[month]} ${day}, ${year}`;
    dataObj.unix = usrInput;
    dataObj.natural = convTime;
  }

  // From natural to Unix
  if (usrInput.match(/[A-Za-z]\w+ [0-9]{1,2}, [0-9]{4}/)) {
    convTime = Date.parse(req.params.data).toString(10);
    dataObj.natural = usrInput.charAt(0).toUpperCase() + usrInput.slice(1);
    dataObj.unix = convTime;
  }

  try {
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(dataObj);
  }
  catch (err) {
    console.error(new Error(err));
    next(err);
  }
}

module.exports = getTimestamp;
