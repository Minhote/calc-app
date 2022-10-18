let body = document.querySelector("body");
let bar = document.querySelector(".calc__head__switcher__wrapper__bar");
let point = document.querySelector(
  ".calc__head__switcher__wrapper__bar__point"
);

// Toggle Switcher
bar.addEventListener("click", (e) => {
  if (e.target.closest(".span-1")) {
    point.style.left = "10%";
    body.removeAttribute("class");
    body.classList.add("theme__1");
  } else if (e.target.closest(".span-2")) {
    point.style.left = "42%";
    body.removeAttribute("class");
    body.classList.add("theme__2");
  }
  if (e.target.closest(".span-3")) {
    point.style.left = "77%";
    body.removeAttribute("class");
    body.classList.add("theme__3");
  }
});
