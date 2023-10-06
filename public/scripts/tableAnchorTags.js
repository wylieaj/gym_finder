const userTableRow = document.getElementById("userAnchorTag");
const gymTableRow = document.getElementById("gymAnchorTag");

// WHEN CLICKING THE ROW WITH THE + SYMBOL IS REDIRECTS YOU TO THE REGISTER USER ROUTE
if (userTableRow) {
  userTableRow.addEventListener("click", () => {
    window.location.href = "/dashboard/users/new";
  });
}

// WHEN CLICKING THE ROW WITH THE + SYMBOL IS REDIRECTS YOU TO THE NEW GYM ROUTE
if (gymTableRow) {
  gymTableRow.addEventListener("click", () => {
    window.location.href = "/dashboard/gyms/new";
  });
}
