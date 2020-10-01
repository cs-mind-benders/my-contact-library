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

function resetUpdateMessage() {
  document.getElementById(
    "updateMessage"
  ).innerHTML = ``;
  searchContact();
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
                <td id="fname${contact.id}">${contact.firstName}</td>
                <td id="lname${contact.id}">${contact.lastName}</td>
                <td id="ph${contact.id}">${contact.phone}</td>
                <td id="em${contact.id}">${contact.email}</td>
                <td>
                  <a href="#">
                    <button type="button" class="btn btn-outline-info btn-rounded btn-sm" data-toggle="modal" data-target="#updateContactModalCenter">
                    <i onclick="editContactModal(${contact.id})" class="icon ion-edit contact-action">
                    </i>
                    </button> 
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
          $("#resultsTable").DataTable().clear().draw();
        }
      }
    };
    xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    searchResults.innerHTML = err.message;
  }
}

function editContactModal(id)
{
  firstName = document.getElementById("fname"+id).innerText
  lastName = document.getElementById("lname"+id).innerText
  phone = document.getElementById("ph"+id).innerText
  email = document.getElementById("em"+id).innerText
  console.log(id)
  var searchResults = document.getElementById("search-results");
  searchResults.innerHTML += `
  <div class="modal fade" id="updateContactModalCenter" tabindex="-1" role="dialog" aria-labelledby="updateModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="exampleModalLongTitle" style="color:black;">Update Contact</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="resetUpdateMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form class="form" role="form" autocomplete="off" id="updateForm" method="POST">
      <div class="modal-body" style="color:black;">
        <div class="form-group">
          <input class="update-contact" name="firstname" placeholder="First Name" value="${firstName}" id="FirstName">
            <div class="invalid-feedback">Oops, you missed this one.</div>
          </div>
          <div class="form-group">
            <input class="update-contact" name="lastname" placeholder="Last Name" value="${lastName}" id="LastName">
            <div class="invalid-feedback">Oops, you missed this one.</div>
          </div>
          <div class="form-group">
            <input class="update-contact" name="phone" placeholder="Phone" value="${phone}" id="Phone">
            <div class="invalid-feedback">Oops, you missed this one.</div>
          </div>
          <div class="form-group">
            <input class="update-contact" name="email" placeholder="Email" value="${email}" id="Email">
            <div class="invalid-feedback">Oops, you missed this one.</div>
          </div>
      </div>
      <h6 id="updateMessage" style="text-align:center; color:green;"></h6>
      <div class="modal-footer">
        <button id="updateButton" onclick="editContact(${id})" type="button" class="btn btn-primary">Save</button>
      </div>
      <span class="text-white" id="updateResult"></span>
      </form>
    </div>
  </div>
</div>`
}

function editContact(id) {
  firstName = document.getElementById("FirstName").value;
  lastName = document.getElementById("LastName").value;
  phone = document.getElementById("Phone").value;
  email = document.getElementById("Email").value;

  let jsonPayload = {
    contactId: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
  };

  let url = urlBase + "/UpdateContact." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (
        this.readyState == XMLHttpRequest.DONE &&
        this.status == 200 &&
        (firstName || lastName || phone || email)
      ) {
        document.getElementById("updateMessage").innerHTML = `Contact Updated`;
        document.getElementById("updateForm").reset();
      }
    };
    if (firstName || lastName || phone || email)
      xhr.send(JSON.stringify(jsonPayload));
  } catch (err) {
    document.getElementById("updateResult").innerHTML = err.message;
  }

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
