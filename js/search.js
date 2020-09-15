document
  .getElementById("searchText")
  .addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  });

const urlBase = "https://mycontactslibrary.com/LAMPAPI";
const extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";
var contacts = [];

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

function searchContact() {
  userId = getUserId();
  var searchText = document.getElementById("searchText").value;
  var search_results = document.getElementById("search-results");

  if (searchText.length >= 3) {
    let jsonPayload = {
      search: searchText,
      UserID: userId,
    };

    var url = urlBase + "/Search." + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    //   xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
      xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          let jsonObject = JSON.parse(xhr.responseText);
          contacts = jsonObject.results;

          search_results.innerHTML = "";

          if (contacts.length > 0) {
            for (i = 0; i < contacts.length; i++) {
              let contact = contacts[i];
              search_results.innerHTML += `<li>Name: ${contact.firstName} ${contact.lastName} ----- Phone: ${contact.phone} ----- Email: ${contact.email}</li> `;
            }
            search_results.style.display = "block";
          } else {
            search_results.innerHTML = "No contacts found.";
          }
        }
      };
      xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
      search_results.innerHTML = err.message;
    }
  } else {
    search_results.innerHTML = "";
  }
}
