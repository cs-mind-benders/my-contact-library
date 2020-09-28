const urlBase = "https://mycontactslibrary.com/LAMPAPI";
const extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";
var contacts = [];

function isAuthenticated() {
  userId = getUserId();

  if (userId < 0) {
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

function resetMessage() {
  document.getElementById(
    "deleteMessage"
  ).innerHTML = ``;
  searchContact();
}

function searchContact() {
  userId = getUserId();
  var searchText = document.getElementById("searchText").value;
  var searchResults = document.getElementById("search-results");
  var searchTable = document.getElementById("search-table");
  var searchResultsError = document.getElementById("search-results-error");

  if (searchText.length >= 1) {
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
      // xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          let jsonObject = JSON.parse(xhr.responseText);
          contacts = jsonObject.results;
          console.log(contacts);

          searchResults.innerHTML = "";

          if (contacts.length > 0) {
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
                  <button type="button" class="btn btn-outline-info btn-rounded btn-sm">
                  <i onclick="editContact(${contact.id})" class="icon ion-edit contact-action">
                  </i>
                  </button> 
                  </a>
                  <a href="#">
                  <button type="button" class="btn btn-outline-danger btn-rounded btn-sm" data-toggle="modal" data-target="#deleteContactModalCenter">
                  <i class="icon ion-android-delete contact-action">
                  </i>
                  </button>
                  <div class="modal fade" id="deleteContactModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLongTitle" style="color:black;">Are you sure?</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="resetMessage()">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <form class="form" role="form" autocomplete="off" id="deleteForm" method="POST">
                        <div class="modal-body" style="color:black;">
                        Are you sure you want to delete this contact?
                        </div>
                        <h6 id="deleteMessage" style="text-align:center; color:red;"></h6>
                        <div class="modal-footer">
                          <button id="deleteButton" onclick="deleteContact(${contact.id})" type="button" class="btn btn-danger" data-dismiss="">Yes, delete</button>
                        </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  </a>
                </td>
              </tr>
              `;
            }
            
          } else {
            searchResultsError.style.display = "block";
            searchResultsError.innerHTML = "<p>No contacts found.</p>";
          }
        }
      };
      xhr.send(JSON.stringify(jsonPayload));
    } catch (err) {
      searchResults.innerHTML = err.message;
    }
  } else {
    searchResultsError.style.display = "none";
    searchResults.innerHTML = "";
  }
}

function editContact(id) {
  // call update api
  console.log(id);
  return true;
}

function deleteContact(id) {
  // console.log(id);
  // return true;
  // document.getElementById("delete-confirm").innerHTML += ``;

  let jsonPayload = {
    contactID: id,
  };

  let url = urlBase + "/DeleteContact." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {

    xhr.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        // document.getElementById("modal").style.display = "none";
        document.getElementById("deleteMessage").innerHTML = "Contact Deleted";
        // document.getElementById("deleteForm").style.display = "none";
      }
    };

    xhr.send(JSON.stringify(jsonPayload));
  }catch (err) {
    document.getElementById("addResult").innerHTML = err.message;
  }
}
