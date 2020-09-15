// Listen for the enter key press to "submit" the form
window.addEventListener(
  "keypress",
  function (e) {
    if (e.keyCode === 13) {
      doLogin();
    }
  },
  false
);

const urlBase = "https://mycontactslibrary.com/LAMPAPI";
const extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;

  var hash = md5(password);

  document.getElementById("loginResult").innerHTML = "";

  let jsonPayload = {
    Login: login,
    Password: hash,
  };

  let url = urlBase + "/Login." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(JSON.stringify(jsonPayload));

    let jsonObject = JSON.parse(xhr.responseText);

    userId = jsonObject.id;

    if (userId < 1) {
      document.getElementById("loginResult").innerHTML =
        "User/Password combination incorrect";
      return;
    }

    firstName = jsonObject.firstName;
    lastName = jsonObject.lastName;

    if (firstName == "" || lastName == "") {
      document.getElementById("loginResult").innerHTML =
        "Error logging in, please try again.";
    } else {
      saveCookie();
      window.location.href = "index.html";
    }
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

function saveCookie() {
  let minutes = 90;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `firstName=${firstName}`;
  document.cookie = `lastName=${lastName}`;
  document.cookie = `userId=${userId}`;
  document.cookie = `expires=${date.toGMTString()}`;
}
