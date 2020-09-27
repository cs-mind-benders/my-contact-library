// Listen for the enter key press to "submit" the form
window.addEventListener(
  "keypress",
  function(e) {
    if (e.keyCode === 13) {
      addUser();
    }
  },
  false
);

const urlBase = "https://mycontactslibrary.com/LAMPAPI";
const extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";

function addUser() {
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;
  email = document.getElementById("email").value;
  login = document.getElementById("signUpLogin").value;
  password = document.getElementById("loginPassword1").value;

  let hash = md5(password);

  document.getElementById("signUpResult").innerHTML = "";

  let jsonPayload = {
    Login: login,
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Password: hash
  };

  let url = urlBase + "/Register." + extension;

  let xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  //   xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        document.getElementById("signUpForm").style.display = "none";
        document.getElementById(
          "signUpTitle"
        ).innerHTML = `Welcome, ${firstName} ${lastName}, your account has been created successfully.`;
      }
    };
    xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    document.getElementById("signUpResult").innerHTML = err.message;
  }
}

function checkPasswordMatch() {
  let password = $("#loginPassword1").val();
  let confirmPassword = $("#loginPassword2").val();

  if (password != confirmPassword)
    $("#passwordMatchAlert").html("Passwords do not match!");
  else $("#passwordMatchAlert").html("Passwords match.");
}

$(document).ready(function() {
  $("#loginPassword2").keyup(checkPasswordMatch);
});