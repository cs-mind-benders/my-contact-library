const urlBase = "https://mycontactslibrary.com/LAMPAPI";
const extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";
var contacts = [];

function isAuthenticated() {
  userId = getUserId();

  if (!userId || userId < 0) {
    window.location.href = "login.html";
  } else {
    getName();
    document.getElementById(
      "userName"
    ).innerHTML = `Welcome, ${firstName} ${lastName}`;
  }
}

function getName() {
  userId = -1;
  var data = document.cookie;
  console.log(data);
  var splits = data.split(";");
  for (var i = 0; i < splits.length; i++) {
    var thisOne = splits[i].trim();
    var tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    }
    if (tokens[0] == "lastName") {
      lastName = tokens[1];
    }
  }
}

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
  return userId;
}

function searchContact() {
  userId = getUserId();
  var searchText = document.getElementById("searchText").value;
  var searchResults = document.getElementById("search-results");

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

        searchResults.innerHTML = "";

        if (contacts.length > 0) {
          if ($.fn.DataTable.isDataTable("#resultsTable")) {
            $("#resultsTable").DataTable().clear().destroy();
          }
          for (i = 0; i < contacts.length; i++) {
            let contact = contacts[i];
            searchResults.innerHTML += `
            <tr>
              <td>${contact.firstName}</td>
              <td>${contact.lastName}</td>
              <td>${contact.phone}</td>
              <td>${contact.email}</td>
              <td>
                <a href="#">
                  <i onclick="editContact(${contact.id})" class="icon ion-edit contact-action">
                  </i>
                </a>
              <a href="#">
                <i onclick="deleteContact(${contact.id})" class="icon ion-android-delete contact-action">
                </i>
              </a>
              </td>
            </tr>
            `;
          }
          $("#resultsTable").DataTable({
            searching: false,
            lengthChange: false,
            language: {
              emptyTable: "No contacts found.",
            },
          });
        } else {
          if (!$.fn.DataTable.isDataTable("#resultsTable")) {
            $("#resultsTable").DataTable({
              searching: false,
              lengthChange: false,
              language: {
                emptyTable: "No contacts found.",
              },
            });
          } else {
            $("#resultsTable").DataTable().clear().draw();
          }
        }
      }
    };
    xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    searchResults.innerHTML = err.message;
  }
}

function editContact(id) {
  // call update api
  console.log(id);
  return true;
}

function deleteContact(id) {
  // call delete api
  console.log(id);
  return true;
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
    phone: phone,
  };

  let url = urlBase + "/AddContact." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (
        this.readyState == XMLHttpRequest.DONE &&
        this.status == 200 &&
        (firstName || lastName || phone || email)
      ) {
        document.getElementById("addMessage").innerHTML = `Contact Added`;
        document.getElementById("addForm").reset();
      }
    };
    if (firstName || lastName || phone || email)
      xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    document.getElementById("addResult").innerHTML = err.message;
  }
}

function logout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = `firstName=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  document.cookie = `lastName=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  document.cookie = `userId=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  window.location.href = "login.html";
}
