const urlBase = "https://mycontactslibrary.com/LAMPAPI";
const extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";

function getUserId() {
    userId = -1;
    var data = document.cookie;
    var splits = data.split(";");
    for (var i = 0; i < splits.length; i++) {
      var thisOne = splits[i].trim();
      var tokens = thisOne.split("=");
      if (tokens[0] == "userId") {
        userId = parseInt(tokens[1].trim());
      }
    }
  
    if (userId > 0) {
      return userId;
    }
  }

function addContact() {
    userId = getUserId();
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    phone = document.getElementById("phone").value;
    email = document.getElementById("email").value;

    document.getElementById("addResult").innerHTML = "";

    let jsonPayload = {
        userID: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone
    };

    let url = urlBase + "/AddContact." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200 && (firstName || lastName || phone || email)) {
              document.getElementById(
                "addMessage"
              ).innerHTML = `Contact Added`;
              document.getElementById("addForm").reset();
            }
          };
          if(firstName || lastName || phone || email)
            xhr.send(JSON.stringify(jsonPayload));
    }catch (err) {
        document.getElementById("addResult").innerHTML = err.message;
    }
  }