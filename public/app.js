window.addEventListener("DOMContentLoaded", () => {
  let button_add = document.querySelector(".add");
  let modal = document.getElementById("myModal");
  let span = document.getElementsByClassName("close")[0];
  let form = document.querySelector("form");
  button_add.onclick = function () {
    // location.assign("/add");
    modal.style.display = "block";
  };
  function close() {
    modal.style.display = "none";
  }
  span.onclick = close;

  window.onclick = function (event) {
    if (event.target == modal) {
      close();
    }
  };

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let content = data.get("content");
    let description = data.get("description");

    try {
      const response = await fetch("http://localhost:4000/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          description,
        }),
      });

      const result = await response.json();
      window.location.reload();
      close();
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
