window.addEventListener("DOMContentLoaded", () => {
  let button_add = document.querySelector(".add");
  let modal = document.getElementById("myModal");
  let span = document.getElementsByClassName("close")[0];
  let form = document.querySelector("form");
  let editBtn = document.querySelector(".edit");
  let deleteBtn = document.querySelector(".delete");
  let submit = document.querySelector(".submit");

  button_add.onclick = open;

  function close() {
    modal.style.display = "none";
  }
  function open() {
    if (form.dataset.edit) {
      submit.textContent = "Edit";
    }

    modal.style.display = "block";
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
    let idSet = editBtn.parentNode.dataset.id;
    let method = e.target.dataset.edit ? "PUT" : "POST";
    let id = idSet ? idSet : null;

    try {
      const response = await fetch("http://localhost:4000/note", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          description,
          id,
        }),
      });

      const result = await response.json();
      window.location.reload();
      close();
    } catch (error) {
      console.error("Error:", error);
    }
  });

  deleteBtn.addEventListener("click", async (e) => {
    let id = +e.target.parentNode.dataset.id;
    if (id) {
      try {
        const response = await fetch("http://localhost:4000/note", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
        const result = await response.json();
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });

  editBtn.addEventListener("click", async (e) => {
    let id = +e.target.parentNode.dataset.id;
    form.dataset.edit = "edit";
    open();
    button_add.textContent = "Edit";

    try {
      const response = await fetch("http://localhost:4000/note?id=" + id);

      const result = await response.json();
      form[0].value = result[0].content;
      form[1].value = result[0].description;
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
