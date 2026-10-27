var aantalLagen = 10;
var breedte;
var hoogte; 

class Raster {
  constructor(r, k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke("grey");
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        rect(
          kolom * this.celGrootte,
          rij * this.celGrootte,
          this.celGrootte,
          this.celGrootte,
        );
      }
    }
    pop();



  }
}


class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
    this.levens = 3;
  }

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x, 0, canvas.width);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(object) {
    if (
      this.x < object.x + raster.celGrootte &&
      this.x + raster.celGrootte > object.x &&
      this.y < object.y + raster.celGrootte &&
      this.y + raster.celGrootte > object.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  toon() {
    image(
      this.animatie[this.frameNummer],
      this.x,
      this.y,
      raster.celGrootte,
      raster.celGrootte,
    );
  }
}

class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Raket {
  constructor(x, y, startsnelheid, afbeelding) {
    this.x = x;
    this.y = y;
    this.startsnelheid = startsnelheid;
    this.snelheidY = -startsnelheid;
    this.zwaartekracht = 0.22;
    this.afbeelding = afbeelding;
    this.afmeting = raster.celGrootte;
  }

  beweeg() {
    this.snelheidY += this.zwaartekracht;
    this.y += this.snelheidY;

    var bovenrand = 0;
    var onderrand = canvas.height - this.afmeting;

    if (this.y < bovenrand) {
      this.y = bovenrand;
      this.snelheidY = 0;
    }

    if (this.y > onderrand) {
      this.y = onderrand;
      this.snelheidY = -this.startsnelheid;
    }
  }

  teken() {
    image(
      this.afbeelding,
      this.x,
      this.y,
      this.afmeting,
      this.afmeting,
    );
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
  raketAfbeelding = loadImage("images/sprites/raket.svg");
}

function setup() {
  canvas = createCanvas(900, 600);
  
  breedte = 900 / aantalLagen;
  hoogte = breedte / 2;
 
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(12, 18);

  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1 * raster.celGrootte;
  for (var b = 0; b < 6; b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);

  }
  var positie1 = floor(random(9,18));
  var positie2 = floor(random(9,18));
  var positie3 = floor(random(9,18));

  alice = new Vijand(700, 200);
  alice.stapGrootte = 1 * eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  bob = new Vijand(600, 400);
  bob.stapGrootte = 1 * eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  cindy = new Vijand(800, 500);
  cindy.stapGrootte = 1 * eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  raketten =[
   
    new Raket(positie1 * raster.celGrootte, canvas.height - raster.celGrootte, 9, raketAfbeelding),
    new Raket(positie2 * raster.celGrootte, canvas.height - raster.celGrootte, 11, raketAfbeelding),
    new Raket(positie3 * raster.celGrootte, canvas.height - raster.celGrootte, 13, raketAfbeelding),
  ];
}

function draw() {
   background(brug);
  push();
  fill("lightslategray");
  stroke("darkslategray");
  tekenPiramide(aantalLagen);
  pop();
  
  raster.teken();

  push();
  fill("black");
  noStroke();
  textSize(25);
  textAlign(LEFT, TOP);
  text("Levens: " + eve.levens, 20, 10);
  pop();

  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();
 
  for (var raket of raketten) {
    raket.beweeg();
    raket.teken();
    if (eve.wordtGeraakt(raket)) {
        eve.levens--;

        raket.y = canvas.height - raket.afmeting;
        raket.snelheidY = -raket.startsnelheid;

        eve.x = 400;
        eve.y = 300;

        if (eve.levens <= 0) {
          background("red");
          fill("white");
          textSize(50);
          text("GAME OVER", 250, 300);
          noLoop();
        }
      }
    }

  if (
    eve.wordtGeraakt(alice) ||
    eve.wordtGeraakt(bob) ||
    eve.wordtGeraakt(cindy)
  ) {
    eve.levens--;

    if (eve.levens <= 0) {
      background("red");
      fill("white");
      textSize(50);
      text("GAME OVER", 250, 300);
      noLoop();
    } else {
      eve.x = 400;
      eve.y = 300;
    }
  }

  if (eve.gehaald) {
    background("green");
    fill("white");
    textSize(40);
    text("Je hebt de overkant gehaald! gefliciteerd!!", 30, 300,);
    noLoop();

  }
}

function tekenPiramide(n) {
  if (n > 0) {
    for (var nr = 0; nr < n; nr++) {
      rect(
        nr * breedte + (aantalLagen - n) * breedte / 2,
        (aantalLagen - n) * hoogte,
        breedte,
        hoogte
      );
    }

    n--;
    tekenPiramide(n);
  }
}
