function setup() {
  canvas = createCanvas(400,400);
  background('grey');
  canvas.parent();
  noLoop();
}

function draw() {
  // groene cirkel zonder rand

  noStroke();
  fill('green');
  ellipse(200,200,375);

  noStroke();
  fill('white');
  ellipse(200,200,300);
  // witte rechthoek met rode rand

  stroke('green');
  fill('white');
  strokeWeight(10);
  rect(100,100,200,200);
}