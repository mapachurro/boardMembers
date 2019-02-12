$(document).ready(function () {
  // Getting a reference to the input field where user adds a new todo
  var $newItemInput = $("input.new-item");
  // Our new todos will go inside the todoContainer
  var $memberContainer = $(".member-container");
  // The container for ex-members
  var $formerContainer = $(".former-container")
  // Adding event listeners for deleting, editing, and adding members
  $(document).on("click", "button.delete", deleteMember);
  $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", ".member-item", editMember);
  $(document).on("keyup", ".member-item", finishEdit);
  $(document).on("blur", ".member-item", cancelEdit);
  $(document).on("submit", "#member-form", insertMember);

  // Our initial members array
  var members = [];

  // Our initial former members array
  var formers = [];

  // Getting todos from database when page loads
  getMembers();
  getFormers();

  // This function resets the todos displayed with new todos from the database
  function initializeRows() {
    $memberContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < members.length; i++) {
      rowsToAdd.push(createNewRow(members[i]));
    }
    $memberContainer.prepend(rowsToAdd);
  }

  // This function grabs todos from the database and updates the view
  function getMembers() {
    $.get("/api/members", function (data) {
      members = data;
      initializeRows();
    });
  }

  // This function fills the former members column
  function initializeFormer() {
    $formerContainer.empty();
    var formerToAdd = [];
    for (var i = 0; i < formers.length; i++) {
      formerToAdd.push(createFormerRow(formers[i]));
    }
    $formerContainer.prepend(formerToAdd);
  }

  // This function grabs former members from the database and updates the view
  function getFormers() {
    $.get("/api/formers", function (data) {
      formers = data;
      console.log("Former board members are: " + formers)
      initializeFormer();
    });
  }





  // This function deletes a todo when the user clicks the delete button
  function deleteMember(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    var name = $(this).data("text");
    formers.push(name);
    $.ajax({
      method: "DELETE",
      url: "/api/members/" + id
    }).then(getFormers);
  }

  // This function handles showing the input box for a user to edit a todo
  function editMember() {
    var currentMember = $(this).data("member");
    $(this).children().hide();
    $(this).children("input.edit").val(currentMember.text);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  // Toggles complete status
  function toggleComplete(event) {
    event.stopPropagation();
    var member = $(this).parent().data("member");
    member.complete = !member.complete;
    updateMember(member);
  }

  // This function starts updating a member in the database if a user hits the "Enter Key"
  // While in edit mode
  function finishEdit(event) {
    var updatedMember = $(this).data("todo");
    if (event.which === 13) {
      updatedMember.text = $(this).children("input").val().trim();
      $(this).blur();
      updateMember(updatedMember);
    }
  }

  // This function updates a todo in our database
  function updateMember(member) {
    $.ajax({
      method: "PUT",
      url: "/api/members",
      data: member
    }).then(getMembers, getFormers);
  }

  // This function is called whenever a todo item is in edit mode and loses focus
  // This cancels any edits being made
  function cancelEdit() {
    var currentMember = $(this).data("member");
    if (currentMember) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentMember.text);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  // This function constructs a new member row
  function createNewRow(member) {
    var $newInputRow = $(
      [
        "<li class='list-group-item todo-item'>",
        "<span>",
        member.text,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        // "<button class='delete btn btn-danger'>x</button>",
        "<button class='complete btn btn-primary'>Remove</button>",
        "</li>"
      ].join("")
    );

    $newInputRow.find("button.delete").data("id", member.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("member", member);
    if (member.complete) {
      $newInputRow.find("span").css("text-decoration", "line-through");
    }
    return $newInputRow;
  }

  // This function constructs a former member row
  function createFormerRow(former) {
    var $newInputRow = $(
      [
        "<li class='list-group-item todo-item'>",
        "<span>",
        former.text,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        "<button class='delete btn btn-danger'>x</button>",
        // "<button class='complete btn btn-primary'>Remove</button>",
        "</li>"
      ].join("")
    );
    $newInputRow.find("button.delete").data("id", former.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("member", former);
    if (former.complete) {
      $newInputRow.find("span").css("text-decoration", "line-through");
    }
    return $newInputRow;
  }

  // This function inserts a new todo into our database and then updates the view
  function insertMember(event) {
    event.preventDefault();
    var member = {
      text: $newItemInput.val().trim(),
      complete: false
    };

    $.post("/api/members", member, getMembers);
    $newItemInput.val("");
  }
});
