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

  document.getElementById('testButton').onclick = function() {
    var method = document.getElementById("testMethod").value;
    if (method == "get") {
      // test RESTful GET API
      httpget('/RESTful/' + email, showRESTfulGet, function(){});
    }
    if (method == "post") {
      // test RESTful POST API
      alert("test POST not implemented");
    }
    if (method == "put") {
      // test RESTful PUT API
      alert("test PUT not implemented");
    }
    if (method == "delete") {
      // test RESTful DELETE API
      alert("test DELETE not implemented");
    }
  };
})();
