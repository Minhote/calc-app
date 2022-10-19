let body = document.querySelector("body");
let barToggle = document.querySelector(".calc__head__switcher__wrapper__bar");
let point = document.querySelector(
  ".calc__head__switcher__wrapper__bar__point"
);
let buttons = [...document.querySelectorAll('[class^="calc__key__"]')];
let barCalc1 = document.querySelector(".calc__bar__1");
let barCalc2 = document.querySelector(".calc__bar__2");

//Audio
let tap = new Audio("./tap.wav");

// Toggle Switcher
barToggle.addEventListener("click", (e) => {
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

//Print the bar
buttons.map((el) => {
  el.addEventListener("mousedown", (e) => {
    el.style.filter = "brightness(1.5)";
    tap.currentTime = 0;
    tap.play();
    let output = e.target.dataset.id;
    console.log(
      output,
      Number(output),
      barCalc2.innerText.at(-1),
      Number(barCalc2.innerText.at(-1))
    );

    //Rellenar primera parte de la operacion

    // Pending solve the fix that allows entering more than 2 points
    if (output == "reset") {
      barCalc2.innerText = "0";
    }

    if (output == "del" && barCalc2.innerText != "0") {
      barCalc2.innerText = barCalc2.textContent.slice(0, -1);
      if (barCalc2.innerText == "") {
        barCalc2.innerText = "0";
      }
    }

    if (barCalc2.innerText == "0" && Number(output)) {
      barCalc2.innerText = output;
    } else if (barCalc2.innerText == "0" && output == ".") {
      barCalc2.innerText = output;
    } else if (
      barCalc2.innerText.at(-1).match(/[\d\.]/g) &&
      output.match(/[^del=rst]/g)
    ) {
      barCalc2.innerText += output;
    } else if (barCalc2.innerText != "0" && output == ".") {
      barCalc2.innerText += output;
    }

    //Rellenar segunda parte de la operacion
    if (barCalc2.innerText.match(/[0-9+\-\./x]/g)) {
      if (barCalc2.innerText.at(-1).match(/[x/]/g) && output.match(/[\-\d]/g)) {
        barCalc2.innerText += output;
      } else if (
        barCalc2.innerText.at(-1).match(/[\-\+]/g) &&
        output.match(/\d/g)
      ) {
        barCalc2.innerText += output;
      } else if (
        barCalc2.innerText.at(-1).match(/[\-\+/x]/g) &&
        output.match(/[\-\+/x]/g)
      ) {
        barCalc2.innerText = barCalc2.textContent.replace(
          barCalc2.innerText.at(-1),
          output
        );
      }
    }
  });
  el.addEventListener("mouseup", () => {
    el.style.filter = "brightness(1)";
  });
});
