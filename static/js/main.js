function fillEmailInputElement() {
  var emailInputElement = document.getElementById('userEmail');
  document.getElementById('emailInput').value = emailInputElement.innerHTML;
  return emailInputElement.innerHTML;
}

function httpget(url, callback, failCallback) {
  var xmlhttp = new XMLHttpRequest();

   xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        callback(eval('(' + xmlhttp.responseText + ')'));
      } else {
        setTimeout(failCallback, 0);
      }
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function showRESTfulGet(data) {
  document.getElementById('nameInput').value = data['name'];
  document.getElementById('phoneInput').value = data['phone'];
  document.getElementById('addressInput').value = data['address'];
  document.getElementById('notesTextarea').value = data['notes'];
}

(function main() {
  var email = fillEmailInputElement();
  httpget('/RESTful/' + email, showRESTfulGet, function(){alert('RESTful GET API test failed!');});
})();
