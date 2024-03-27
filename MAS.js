//Variables para botones
let button,
  simular = false;

//Variables de constantes para el sistema
let masa, constanteK, longitudCuerda, radioDisco, angulo;

let sliderMasa, sliderElastica, sliderDisco, sliderAngulo, sliderL, sliderK;

//Variables de cambio (sliders)
let valorMasa, valorElastica, valorAngulo, valorRadio, valorLongitudC;

let widthX = screen.width,
  widthY = screen.height,
  positionSliderX = 1000;
positionTextX = positionSliderX - 200;

//Variables de prueba: Pendulo
let angle, bob, len, origin, mass;

//Variables de prueba: Resorte
let x,
  y = 20,
  forceElasticidad,
  k = 0.01,
  restLength = 200,
  bobResorte,
  anchor,
  velocity,
  gravityResorte;

let angleV = 0,
  angleA = 0.001; //Simulan la velocidad y la aceleracion

let gravity = 0.01;

function setup() {
  //Se crea el canvas
  createCanvas(widthX, widthY - 180);
  controles();
  barrasControl();
  angleMode(RADIANS); //Cambia el valor del angulo a grados

  //Partes de un pendulo
  origin = createVector(200, -40);
  angle = PI / 4; //Simula el angulo
  bob = createVector();
  len = 300; //Simula la longitud de la cuerda
  mass = 15;

  //Partes de un resorte
  anchor = createVector(-140, 250);
  velocity = createVector(0, 0);
  gravityResorte = createVector(0, 0.1);
}

function draw() {
  informacion();
  obtenerValores();
  if (simular) {
    simularCaso();
  }
}

//Funcion que puede ser quitada
function controles() {
  //Creacion del boton para simular
  button = createButton("Simular caso");
  button.position(widthX - 400, 400);
  button.mousePressed(() => (simular = true));
  //Creacion de boton para reiniciar
  stop = createButton("Reiniciar caso");
  stop.position(widthX - 300, 400);
  stop.mousePressed(() => window.location.reload());
}

//Funcion para crear sliders que contendran los valores del sistema
function barrasControl() {
  fill(139, 39, 3);
  //Valores de la masa
  sliderMasa = createSlider(1, 50, 1, 1);
  sliderMasa.position(positionSliderX, 150);
  //Valores de la constante de elasticidad (K)
  sliderK = createSlider(1, 100, 1, 1);
  sliderK.position(positionSliderX, 200);
  //Valores de la longitud de la cuerda
  sliderL = createSlider(68, 300, 1, 1);
  sliderL.position(positionSliderX, 250);
  //Valores del angulo
  sliderAngulo = createSlider(-10, 10, 1, 0.1);
  sliderAngulo.position(positionSliderX, 300);
  //Valores del radio del disco
  sliderDisco = createSlider(10, 100, 1, 1);
  sliderDisco.position(positionSliderX, 350);
}

//Muestra la informacion necesaria para los datos
function informacion() {
  background(40, 114, 111);
  textSize(15);
  noStroke();
  fill(0, 0, 0);
  translate(200, 100);
  text("Masa (kg) = " + valorMasa, positionTextX, -40);
  text("Constante Elástica = " + valorElastica, positionTextX, 10);
  text("Longitud Cuerda = " + valorLongitudC, positionTextX, 60);
  text("Angulo = " + valorAngulo, positionTextX, 110);
  text("Radio Disco = " + valorRadio, positionTextX, 160);
}

// Funcion para obtener valores de los sliders
function obtenerValores() {
  //Obtiene el valor del slider y lo asigna a la variable
  valorMasa = sliderMasa.value();
  valorElastica = sliderK.value();
  valorLongitudC = sliderL.value();
  valorAngulo = sliderAngulo.value();
  valorRadio = sliderDisco.value();

  sliderDisco.value(valorMasa * 2);
  //angle = (valorAngulo * PI) / 180;
}

function simularCaso() {
  fill(38, 117, 241);
  stroke(0, 0, 0);
  rect(-150, -50, 20, 500);
  rect(-150, -50, 500, 20);
  pendulo();
  resorte();
}

function pendulo() {
  circle(200, -40, 20);

  let omega, Inercia, cuerda, anguloPrueba;
  anguloPrueba = (valorAngulo * PI) / 180;
  text("Angulo ctmr: " + anguloPrueba, 200, 50);

  cuerda = valorLongitudC / 100;
  //Calculando el vector bob
  bob.x = valorLongitudC * sin(angle) + origin.x;
  bob.y = valorLongitudC * cos(angle) + origin.y;

  let force = (-1 * valorMasa * gravity * sin(angle)) / 100;
  angleA = force / cuerda;

  angle += angleV;
  angleV += angleA;

  text("Velocidad angular (NO ES, CREO): " + angleV, 200, 100);
  text("Aceleracion angular (NO ES, CREO): " + angleA, 200, 200);

  Inercia =
    (1 / 2) * valorMasa * pow(radioDisco, 2) +
    valorMasa * pow(cuerda + valorRadio, 2);

  text("Valor de inercia: " + Inercia.toFixed(2), 200, 400);
  omega = sqrt(
    (valorElastica * pow(cuerda, 2) + valorMasa * gravity * cuerda) / Inercia
  );

  text("Valor de Omega: " + omega, 200, 300);

  angleV *= 0.99; //Va reduciendo la fuerza, comentarlo si se quiere el pendulo oscilando por siempre

  stroke(225);
  strokeWeight(4);
  fill(54, 245, 117);
  //line(-550, -300, -550, -150); //Se cambiaría el último parámetro para la longitud
  line(origin.x, origin.y, bob.x, bob.y);
  //circle(-550, -150, 64); // Se cambiaría el último parámetro para el radio
  circle(bob.x, bob.y, valorRadio);
}

function resorte() {
  fill(45, 197, 244);
  noStroke();
  circle(anchor.x, anchor.y, 25);
  stroke(225);
  strokeWeight(4);
  line(anchor.x, anchor.y, bob.x, bob.y);

  let force = p5.Vector.sub(bob, anchor);
  let x = force.mag() - valorLongitudC / 100;
  force.normalize();
  force.mult(-1 * (valorElastica / 100) * x);

  // F = M * A
  velocity.add(force);
  velocity.add(gravity);
  velocity.mult(0.99);
  bob.add(velocity);
}

function calculos() {}
