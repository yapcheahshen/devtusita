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

function httpdelete(url, callback, failCallback) {
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

  xmlhttp.open("DELETE", url, true);
  xmlhttp.send();
}

function httppost(jsonString, url, callback, failCallback) {
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

  xmlhttp.open("POST", url, true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(jsonString);
}

function readInputAndConvertToJSON() {
  var data = {};
  data['name'] = document.getElementById('nameInput').value;
  data['phone'] = document.getElementById('phoneInput').value;
  data['address'] = document.getElementById('addressInput').value;
  data['notes'] = document.getElementById('notesTextarea').value;

  return JSON.stringify(data);
}

(function main() {
  var email = fillEmailInputElement();

  document.getElementById('testButton').onclick = function() {
    var method = document.getElementById("testMethod").value;
    if (method == "get") {
      // test RESTful GET API
      httpget('/RESTful/' + email, showRESTfulGet, function(){alert("get failed");});
    }
    if (method == "post") {
      // test RESTful POST API
      httppost(readInputAndConvertToJSON(), '/RESTful/' + email, function(){alert("post success");}, function(){alert("post failed");});
    }
    if (method == "put") {
      // test RESTful PUT API
      alert("test PUT not implemented");
    }
    if (method == "delete") {
      // test RESTful DELETE API
      httpdelete('/RESTful/' + email, function(){alert("deletion succeeded");},
                                      function(){alert("deletion failed");});
    }
  };
})();
