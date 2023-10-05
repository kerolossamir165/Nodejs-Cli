window.addEventListener("DOMContentLoaded", () => {
  let button_add = document.querySelector(".add");
  let modal = document.getElementById("myModal");
  let span = document.getElementsByClassName("close")[0];

  button_add.onclick = function () {
    // location.assign("/add");
    modal.style.display = "block";
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  fetch("http://localhost:4000/note?name=first")
    .then((el) => {
      return el.text();
    })
    .then((d) => console.log(d));
});
