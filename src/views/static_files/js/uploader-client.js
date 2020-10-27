/**
 * Client-side script for File Analyzer
 * @function uploader-client
 * @see file-analyzer
 */
const uploaderClient = () => {
  const formObj = document.querySelector('#form');
  const fileObj = document.querySelector('#selector');
  let apiUrl = window.location.href + '/api/v1/findsize';

  // Manual AJAX request with form data
  const ajaxRequest = (method, url, callback) => {
    const xmlhttp = new XMLHttpRequest();

    // Need to override the form submit
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
    const FD = new FormData(formObj);

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        callback(xmlhttp.response);
      }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send(FD);
  }

  const makeRequest = () => {
    if (fileObj.value) {
      ajaxRequest('POST', apiUrl, (data) => {
        // alert('File Size -- ' + data);
        document.write('File Size -- ' + data)
      });
    }
  }

  // Override form's submit event to make custom request
  formObj.onsubmit = (event) => {
    event.preventDefault();
    makeRequest();
    return false;
  };
};

window.addEventListener('load', () => {
  uploaderClient();
});
