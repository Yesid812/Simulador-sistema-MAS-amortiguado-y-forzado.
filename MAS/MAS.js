//Variables para botones
let button,
  simular = false;
pausar = false;

// Variables para el canvas
let containerWidth = document.getElementById("p5-container").offsetWidth;
let containerHeight = document.getElementById("p5-container").offsetHeight;
//Variables de constantes para el sistema
let bandera = 0,
  paso = 0,
  Periodo,
  Frecuencia;

//Variables para los sliders
let sliderMasa, sliderDisco, sliderAngulo, sliderL, sliderK, sliderVelocidad;

//Variables de cambio (sliders)
let valorMasa, valorElastica, valorAngulo, valorRadio, valorLongitudC;

//Variables para indicar la posición de los datos
let widthX = screen.width,
  widthY = screen.height,
  positionSliderX = 1000,
  positionTextX = positionSliderX - 200;

//Variables para: Pendulo y resorte
let angle = valorAngulo,
  anguloTemp = 0,
  posicion,
  puntoOrigen,
  anchor,
  velocityAngle = 0;

//Variables utilizadas en los calculos
let W0 = 0,
  Inercia = 0,
  cuerda = 0,
  RadioNuevo = 0,
  Phi = 0,
  Amplitud = 0,
  t = 0,
  seno = -1,
  coseno = 1;

//Variables de tiempo para graficas
let tX = 0,
  tV = 0,
  tA = 0;
var cnt1 = 0,
  cnt2 = 0,
  cnt3 = 0;

//Variable para simular la gravedad
let gravity = 9.8;

//Funcion propia de P5 para poder dibujar constantemente lo que se necesita
function draw() {
  informacion();
  if (simular && !pausar) {
    clear(); // Verifica si la simulación está pausada
    obtenerValores();
    simularCaso();
  }
}

//Funcion para predefinir la configuración del sistema
function setup() {
  //Se crea el canvas
  let canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent("p5-container");
  initControles(); //Botones
  angleMode(RADIANS); //Cambia el valor del angulo a grados

  frameRate(60);
  puntoOrigen = createVector(350, 80);
  posicion = createVector(-140, 156);

  //Partes de un resorte
  anchor = createVector(55, posicion.y);

  //iniciar valores
  valorMasa = document.getElementById("sliderMasa").value;
  valorElastica = document.getElementById("sliderK").value;
  valorLongitudC = document.getElementById("sliderL").value;
  valorAngulo = document.getElementById("sliderAngulo").value;
  valorRadio = document.getElementById("sliderDisco").value;
  velocityAngle = document.getElementById("sliderVelocidad").value;

  document
    .getElementById("sliderMasa")
    .addEventListener("input", obtenerValores);
  document.getElementById("sliderK").addEventListener("input", obtenerValores);
  document.getElementById("sliderL").addEventListener("input", obtenerValores);
  document
    .getElementById("sliderAngulo")
    .addEventListener("input", obtenerValores);
  document
    .getElementById("sliderDisco")
    .addEventListener("input", obtenerValores);
  document
    .getElementById("sliderVelocidad")
    .addEventListener("input", obtenerValores);
}

//Muestra la informacion necesaria para los datos a utilizar
function informacion() {
  valorMasa = document.getElementById("sliderMasa").value;
  valorElastica = document.getElementById("sliderK").value;
  valorLongitudC = document.getElementById("sliderL").value;
  valorAngulo = document.getElementById("sliderAngulo").value;
  valorRadio = document.getElementById("sliderDisco").value;
  velocityAngle = document.getElementById("sliderVelocidad").value;

  document.getElementById("masaInfo").innerText = +valorMasa;
  document.getElementById("sliderKValue").innerText = +valorElastica;
  document.getElementById("sliderLValue").innerText = +valorLongitudC;
  document.getElementById("sliderAnguloValue").innerText = +valorAngulo;
  document.getElementById("sliderDiscoValue").innerText = +valorRadio;
  document.getElementById("sliderVelocidadValue").innerText = +velocityAngle;
}

function obtenerValores() {
  valorMasa = parseFloat(document.getElementById("sliderMasa").value);
  valorElastica = parseFloat(document.getElementById("sliderK").value);
  valorLongitudC = parseFloat(document.getElementById("sliderL").value);
  valorAngulo = parseFloat(document.getElementById("sliderAngulo").value);
  valorRadio = parseFloat(document.getElementById("sliderDisco").value);
  velocityAngle = parseFloat(document.getElementById("sliderVelocidad").value);
  angle = parseFloat(document.getElementById("sliderAngulo").value) / 10;
}

//Funcion para simular el caso correspondiente
function simularCaso() {
  fill(38, 117, 241);
  stroke(0, 0, 0);
  rect(50, 60, 20, 400);
  rect(50, 60, 380, 20);
  pendulo();
  resorte();
}

function updateSliderValue(sliderId, displayId) {
  let slider = document.getElementById(sliderId);
  let display = document.getElementById(displayId);

  if (slider && display) {
    display.textContent = slider.value;
  }
}

//Funcion para mostrar los botones de simulación y reinicio
function initControles() {
  // Obtener los botones del DOM
  const simularButton = document.getElementById("simularButton");
  const reiniciarButton = document.getElementById("reiniciarButton");

  // Asignar funciones a los botones
  simularButton.addEventListener("click", () => {
    simular = true;
    pausar = false; // Asegúrate de que la simulación no esté pausada al iniciar
  });

  reiniciarButton.addEventListener("click", () => {
    if (!pausar) {
      // Verifica si la simulación está pausada
      pausar = true; // Cambia el estado de pausa
    }
  });
}

//Funcion para simular un pendulo y sus calculos
function pendulo() {
  //circle(200, -40, 20);
  //Calculando el vector posicion
  posicion.x =
    valorLongitudC * 100 * sin(angle * 10 * (Math.PI / 180)) + puntoOrigen.x;
  posicion.y =
    valorLongitudC * 100 * cos(angle * 10 * (Math.PI / 180)) + puntoOrigen.y;

  if (simular) {
    cuerda = valorLongitudC;
    RadioNuevo = valorRadio;
    if (bandera < 1) {
      anguloTemp = angle * 10 * (Math.PI / 180);
      Inercia =
        (valorMasa * Math.pow(RadioNuevo, 2)) / 2 +
        valorMasa * Math.pow(cuerda + RadioNuevo, 2);
      W0 = sqrt(
        (valorElastica * pow(cuerda, 2) + valorMasa * gravity * cuerda) /
          Inercia
      );
      Periodo = TWO_PI / W0;
      Frecuencia = 1 / Periodo;
      //velocityAngle= (velocityAngle)*(Math.PI/180);
      Phi = Math.abs(atan(velocityAngle / (anguloTemp * W0)));
      //cos+ sen+ c1, lo dejaríamos tal cual
      if (coseno * anguloTemp < 0 && seno * velocityAngle > 0) {
        //cos- sen+ c2
        Phi = Math.PI - Phi;
      }
      if (coseno * anguloTemp < 0 && seno * velocityAngle < 0) {
        //cos- sen- c3
        Phi = Math.PI + Phi;
      }
      if (coseno * anguloTemp > 0 && seno * velocityAngle < 0) {
        //cos+ sen- c4
        Phi = 2 * Math.PI - Phi;
      }
      Amplitud = anguloTemp / cos(Phi);
    }
    bandera++;

    fill(0);
    noStroke();

    //Calculamos el movimiento del pendulo
    const xt = Amplitud.toFixed(3) * cos(W0 * t + Phi);

    if (!isNaN(xt)) {
      anguloTemp = xt;
    }
    posicion.x = valorLongitudC * 100 * sin(anguloTemp) + puntoOrigen.x;
    posicion.y = valorLongitudC * 100 * cos(anguloTemp) + puntoOrigen.y;

    if (paso < 1) {
      graficas();
    }
    paso++;
    t += 0.01;
    let resultado = document.getElementById("Ecuacion");

    // Asignar un valor al elemento
    resultado.innerHTML =
      "X(t)= " +
      Amplitud.toFixed(3) +
      " * cos(" +
      W0.toFixed(2) +
      " * " +
      t.toFixed(2) +
      " + " +
      Phi.toFixed(2) +
      ")";
    /*
    document.getElementById('valor-omega').innerText = "Valor de Omega: " + W0.toFixed(3) + " rad/seg";
    document.getElementById('valor-inercia').innerText = "Valor de la inercia: " + Inercia.toFixed(3) + " kg*m2";
    document.getElementById('valor-phi').innerText = "Phi: " + Phi.toFixed(3);
    document.getElementById('valor-amplitud').innerText = "Amplitud: " + Amplitud.toFixed(3) + " m";
    document.getElementById('valor-periodo').innerText = "Valor del Periodo: " + Periodo.toFixed(3) + "   s";
    document.getElementById('valor-ecuacion').innerText = "X(t)= " + Amplitud.toFixed(3) + " * cos(" + W0.toFixed(2) + " * " + t.toFixed(2) + " + " + Phi.toFixed(2) + ")";
    */
  }
  stroke(0);
  strokeWeight(2.6);
  fill(54, 24, 117);
  line(puntoOrigen.x, puntoOrigen.y, posicion.x, posicion.y);
  circle(posicion.x, posicion.y, valorRadio * 100);
}

//Funcion que simula un resorte
function resorte() {
  anchor = createVector(65, valorLongitudC * 100 + 80);
  noFill();
  stroke(0); // Color negro
  strokeWeight(2.6 + valorElastica * 0.05); // Grosor de la línea

  let numSegments = 2000; // Número de segmentos del resorte

  // Dibujar las espirales del resorte
  beginShape();

  for (let i = 0; i < numSegments; i++) {
    let t = map(i, 0, numSegments, 0, TWO_PI * 10); // Ajusta el rango de la función sinusoidal

    let segmentStart = p5.Vector.lerp(anchor, posicion, i / numSegments);
    let segmentEnd = p5.Vector.lerp(anchor, posicion, (i + 1) / numSegments);

    let midX = (segmentStart.x + segmentEnd.x) / 2;
    let midY = (segmentStart.y + segmentEnd.y) / 2;

    let angle = atan2(
      segmentEnd.y - segmentStart.y,
      segmentEnd.x - segmentStart.x
    );

    let offset = 10 * sin(t); // Ajuste para hacer las espirales

    let endX = midX + offset * cos(angle - HALF_PI);
    let endY = midY + offset * sin(angle - HALF_PI);

    vertex(endX, endY);
  }
  endShape();
}

//Funciones para simular el movimiento de X (Posicion), V (Velocidad), A (Aceleracion)
function getDataPosition() {
  var Xt = Amplitud * Math.cos(W0 * tX + Phi); //Cambiarla si es necesario
  return Xt;
}
function getDataVelocity() {
  var Vt = -Amplitud * W0 * Math.sin(W0 * tV + Phi); //Cambiarla si es necesario
  return Vt;
}
function getDataAceleration() {
  var At = -Amplitud * pow(W0, 2) * Math.cos(W0 * tV + Phi); //Cambiarla si es necesario
  return At;
}

function graficas() {
  if (!pausar) {
    // Verifica si la simulación está pausada
    var layout = {
      autosize: true,
      xaxis: { title: "Tiempo (s)", range: [0, 50] }, // Ajusta el rango inicial del eje x para un zoom reducido
      yaxis: { title: "Amplitud (rads)" },
      legend: { x: 0, y: 1.2, orientation: "h" }, // Ajusta la posición de la leyenda
      margin: { t: 50, b: 50, l: 50, r: 50 }, // Ajusta los márgenes del gráfico
    };

    // Asegura que la posición inicial sea 0
    tX = 0;

    let positionData = {
      y: [getDataPosition()],
      type: "line",
      name: "Posición",
    };
    let velocityData = {
      y: [getDataVelocity()],
      type: "line",
      name: "Velocidad",
    };
    let acelerationData = {
      y: [getDataAceleration()],
      type: "line",
      name: "Aceleración",
    };

    Plotly.newPlot(
      "Movimientos",
      [positionData, velocityData, acelerationData],
      layout
    );

    setInterval(function () {
      if (!pausar) {
        // Verifica si la simulación está pausada
        tX += 0.1; // Incremento de tiempo aumentado para velocidad
        tV += 0.1;
        tA += 0.1;

        // Agrega nuevos datos a los conjuntos de datos
        Plotly.extendTraces("Movimientos", { y: [[getDataPosition()]] }, [0]);
        Plotly.extendTraces("Movimientos", { y: [[getDataVelocity()]] }, [1]);
        Plotly.extendTraces("Movimientos", { y: [[getDataAceleration()]] }, [
          2,
        ]);

        // Ajusta el rango del eje x para que se mueva con los datos
        let update = {
          xaxis: { range: [tX, tX + 50] }, // Ajusta el rango del eje x para que comience en tX y termine en tX + 50
        };
        Plotly.relayout("Movimientos", update);
      }
    }, 50); // Intervalo reducido para una mayor velocidad de animación
  }
}
