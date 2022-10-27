let body = document.querySelector("body");
let barToggle = document.querySelector(".calc__head__switcher__wrapper__bar");
let point = document.querySelector(
  ".calc__head__switcher__wrapper__bar__point"
);
let buttons = [...document.querySelectorAll('[class^="calc__key__"]')];
let barCalc1 = document.querySelector(".calc__bar__1");
let barCalc2 = document.querySelector(".calc__bar__2");
console.log(buttons);
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

    // Resetear todo si ya esta lleno (Es una calculadore normal, no cientifica XD)
    if (
      output.match(/\d/g) &&
      barCalc1.innerText != "" &&
      barCalc2.innerText != ""
    ) {
      buttons[16].classList.remove("shine");
      barCalc1.innerText = "";
      barCalc2.innerText = "";
    } else if (
      output.match(/(del|x|\+|\-|\/|=)/g) &&
      barCalc1.innerText != "" &&
      barCalc2.innerText != ""
    ) {
      return;
    }

    //Rellenar primera parte de la operacion
    if (output == "reset") {
      if (buttons[16].classList.contains("shine")) {
        buttons[16].classList.remove("shine");
      }
      barCalc1.innerText = "";
      barCalc2.innerText = "0";
      console.clear();
    }

    // Borrar uno por uno
    if (output == "del" && barCalc2.innerText != "0") {
      barCalc2.innerText = barCalc2.textContent.slice(0, -1);
      if (barCalc2.innerText == "") {
        barCalc2.innerText = "0";
      }
    }

    // Función para dividir el input
    let arrs = () => barCalc2.innerText.split(/(x|\-|\+|\/)/g);

    //Ingresar numeros
    if (!isNaN(output) && barCalc2.innerText == "0") {
      barCalc2.innerText = output;
      arrs();
    }

    //Conflicto de los signos
    //Detecta si el output es un signo y lo asigna al final de la barra
    else if (output.match(/(x|\-|\+|\/)/g)) {
      console.log("soy signo", arrs().at(-1), arrs().at(-1).at(-1));
      //Ingresar Numero negativo de primero
      if (
        (output == "-" && barCalc2.innerText == "0") ||
        (output == "-" && barCalc2.innerText == "-")
      ) {
        barCalc2.innerText = output;
        return;
      }
      // Comprueba si ya tiene un signo adelante
      if (arrs().at(-1).length == "") {
        console.log("ya hay un signo adelante", arrs().at(-2), output);
        // Comprueba si el signo que tiene adelante es de multiplicación o división y si el output es signo "-"
        if ((arrs().at(-2) == "x" || arrs().at(-2) == "/") && output == "-") {
          barCalc2.innerText += output;
        }
        // Previniendo conflictos con el "/-" y "x-"
        else if (
          arrs()
            .filter((el) => el != "")
            .at(-1) == "-" &&
          arrs()
            .filter((el) => el != "")
            .at(-2)
            .match(/(x|\/)/g)
        ) {
          console.log('No deberias cambiar el "-"');
          return;
        }
        //Caso contrario cambia signo sin ninguna novedad
        else {
          console.log("cambia signo");
          let input = barCalc2.innerText;
          input = input.slice(0, -1);
          input += output;
          barCalc2.innerText = input;
        }
      } else if (arrs().at(-1).at(-1).match(/\d/g)) {
        barCalc2.innerText += output;
      }
    }
    // Conflicto de los puntos
    else if (output == "." && barCalc2.innerText == "0") {
      barCalc2.innerText = output;
      arrs();
    } else if (output == ".") {
      if (arrs().at(-1).includes(".")) {
        return;
      } else {
        barCalc2.innerText += output;
      }
    } else if (output != "=" && isNaN(output)) {
      return;
    } else if (output == "=") {
      console.clear();
      //Resolver Operación
      let signosDeOperación = [];
      let ar = arrs().filter((el) => el != "");
      ar.map((el, i) => {
        //console.log(typeof ar[i - 1], el, ar[i + 1]);
        if (el == "-" && ar[i - 1] === undefined) {
          return;
        }
        if (el.match(/[x\+\-\/]/g) && ar[i - 1].match(/[^x\+\-\/]/g)) {
          signosDeOperación.push(el);
        }
      });
      console.log(ar);
      let arnovo = [];
      let res = [];

      signosDeOperación.map((el, i) => {
        //console.log(ar.indexOf(el));
        let part = ar.splice(0, ar.indexOf(el) + 1);
        part.pop();
        arnovo.push(part);

        if (el == "x") {
          signosDeOperación[i] = "*";
        }
      });
      console.log(signosDeOperación);

      arnovo.map((el) => {
        if (el.length == 2) {
          console.log(el, arnovo.indexOf(el));
          arnovo[arnovo.indexOf(el)] = [el[0] + el[1]];
        }
      });

      if (ar.length == 2) {
        ar = [ar[0] + ar[1]];
      }
      console.log(arnovo, ar, [...arnovo, [...ar]].flat());

      // Finalmente se evalua y muestra el resultado
      [...arnovo, [...ar]].flat().map((el, i) => {
        res.push(el);
        res.push(signosDeOperación[i]);
      });
      res.pop();
      let result = eval(res.join(""));

      //Controlar los decimales
      if (result.toString().indexOf(".") != -1) {
        let arrofres = result.toString().split(".");

        if (arrofres[1].length > 10) {
          arrofres[1] = arrofres[1].slice(0, 10);
        }

        if (arrofres[1].indexOf("0") != -1) {
          arrofres[1] = arrofres[1].slice(0, arrofres[1].indexOf("0"));
        }
        barCalc1.innerText = barCalc2.innerText;
        barCalc2.innerText = arrofres.join(".");
      } else {
        barCalc1.innerText = barCalc2.innerText;
        barCalc2.innerText = result;
      }
    } else {
      barCalc2.innerText += output;
      arrs();
    }
    //console.log(arrs());
  });

  el.addEventListener("mouseup", () => {
    el.style.filter = "brightness(1)";
    if (barCalc1.innerText != "" && barCalc2.innerText != "") {
      buttons[16].classList.add("shine");
    }
  });
});
