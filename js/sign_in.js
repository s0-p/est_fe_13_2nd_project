import renderFooter from './components/footer.js';
renderFooter();

const form = document.querySelector(".login");
const idInput = document.querySelector(".text_box");
const pwInput = document.querySelector(".password_box");

const idError = document.querySelector(".id_error");
const pwError = document.querySelector(".pw_error");

form.addEventListener("submit", function (e) {
  let isValid = true;

  idError.style.display = "none";
  pwError.style.display = "none";

  idInput.classList.remove("input_error");
  pwInput.classList.remove("input_error");

  if (idInput.value.trim() === "") {
    idError.style.display = "block";
    idInput.classList.add("input_error");
    isValid = false;
  }

  if (pwInput.value.trim() === "") {
    pwError.style.display = "block";
    pwInput.classList.add("input_error");
    isValid = false;
  }

  if (!isValid) {
    e.preventDefault();
    return;
  }

  if (isValid) {
    alert("로그인 시도!");
  }
});

idInput.addEventListener("input", () => {
  idError.style.display = "none";
  idInput.classList.remove("input_error");
});

pwInput.addEventListener("input", () => {
  pwError.style.display = "none";
  pwInput.classList.remove("input_error");
});