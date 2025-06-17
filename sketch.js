let arvores = [];
let casas = [];
let fim = false;
let nuvens = [];
let fadeCinza = 0;
let jogoIniciado = false;

function setup() {
  createCanvas(500, 600);
  for (let i = 0; i < 20; i++) {
    arvores.push(new Arvore(random(30, width - 30), random(300, height - 100)));
  }
  for (let i = 0; i < 5; i++) {
    nuvens.push(new Nuvem(random(width), random(50, 150)));
  }
}

function draw() {
  if (!jogoIniciado) {
    telaDeInicio();
    return;
  }

  if (fim) {
    fadeCinza = min(fadeCinza + 2, 255);
    tint(255 - fadeCinza);
    background(80);
    desenharChuva();
    for (let casa of casas) {
      push();
      grayscaleCasa(casa);
      pop();
    }
    noTint();
    fill(0, min(fadeCinza, 200));
    rect(30, 220, 440, 160, 15);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    if (fadeCinza >= 200) {
      text("Parabéns, você acabou de desmatar todo o mundo.\nViva sua vida sem cor agora!", width / 2, 280);
    }
    return;
  }

  desenharFlorestaDeFundo();

  if (casas.length >= 8) {
    for (let nuvem of nuvens) {
      nuvem.update();
      nuvem.show();
    }
  }

  if (casas.length >= 12) {
    desenharChuva();
  }

  for (let casa of casas) {
    casa.show();
  }

  for (let arvore of arvores) {
    arvore.update();
    arvore.show();
  }

  let percentualVerde = int((arvores.length / (arvores.length + casas.length)) * 100);
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text("Árvores: " + arvores.length, 10, 10);
  text("Casas: " + casas.length, 10, 30);
  text("Área verde restante: " + percentualVerde + "%", 10, 50);

  fill(percentualVerde > 30 ? "green" : "red");
  rect(10, 70, percentualVerde * 2.5, 10);
  noStroke();
  fill(255);
  rect(10 + percentualVerde * 2.5, 70, 250 - percentualVerde * 2.5, 10);

  if (percentualVerde <= 0 && !fim) {
    fim = true;
    arvores = [];
  }
}

function mousePressed() {
  if (fim || !jogoIniciado) return;

  for (let i = arvores.length - 1; i >= 0; i--) {
    if (arvores[i].isClicked(mouseX, mouseY)) {
      let posX = arvores[i].x;
      let posY = arvores[i].y;
      arvores.splice(i, 1);
      casas.push(new Casa(posX, posY, casas.length));
      break;
    }
  }
}

function desenharFlorestaDeFundo() {
  let bgColor = casas.length < 10 ? [34, 90, 34] : [80, 80, 80];
  background(...bgColor);

  noStroke();
  for (let i = 0; i < width; i += 20) {
    fill(0, 100, 0, 40);
    ellipse(i + random(-5, 5), height - 30 + sin(frameCount * 0.01 + i) * 5, 40, 40);
  }

  fill(46, 139, 87);
  rect(0, height - 100, width, 100);
}

function desenharChuva() {
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = (frameCount * 5 + i * 15) % height;
    stroke(200, 200, 255, 100);
    line(x, y, x, y + 5);
  }
}

class Arvore {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.copa = 20;
    this.maxCopa = 45;
  }

  show() {
    fill(139, 69, 19);
    rect(this.x - 4, this.y, 8, 25);
    fill(0, 150 + random(50), 0);
    ellipse(this.x, this.y, this.copa);
  }

  update() {
    if (this.copa < this.maxCopa) {
      this.copa += 0.05;
    }
  }

  isClicked(mx, my) {
    return dist(mx, my, this.x, this.y) < this.copa / 2;
  }
}

class Casa {
  constructor(x, y, index) {
    this.x = x;
    this.y = y;
    this.index = index;
  }

  show() {
    noStroke();
    if (this.index < 10) {
      fill(255, 0, 0);
      rect(this.x - 12, this.y, 24, 24);
      fill(139, 69, 19);
      triangle(this.x - 12, this.y, this.x, this.y - 15, this.x + 12, this.y);
      fill(255);
      rect(this.x - 4, this.y + 8, 8, 8);
    } else if (this.index < 15) {
      fill(255, 140, 0);
      rect(this.x - 12, this.y - 10, 24, 40);
      fill(0);
      rect(this.x - 4, this.y + 10, 8, 8);
      rect(this.x - 4, this.y - 2, 8, 8);
    } else {
      fill(100);
      rect(this.x - 15, this.y - 30, 30, 60);
      fill(255);
      for (let j = -20; j < 20; j += 15) {
        rect(this.x - 8, this.y + j, 5, 5);
        rect(this.x + 3, this.y + j, 5, 5);
      }
    }
  }
}

class Nuvem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = random(0.3, 1);
  }

  update() {
    this.x += this.vel;
    if (this.x > width + 40) {
      this.x = -60;
    }
  }

  show() {
    fill(255, 250);
    ellipse(this.x, this.y, 40);
    ellipse(this.x + 20, this.y + 10, 50);
    ellipse(this.x - 20, this.y + 10, 45);
  }
}

function grayscaleCasa(casa) {
  fill(180);
  rect(casa.x - 12, casa.y, 24, 24);
  fill(100);
  triangle(casa.x - 12, casa.y, casa.x, casa.y - 15, casa.x + 12, casa.y);
  fill(200);
  rect(casa.x - 4, casa.y + 8, 8, 8);
}

function telaDeInicio() {
  background(30, 60, 30);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("🌳 Da floresta à cidade 🌆", width / 2, 140);

  textSize(20);
  text("A transformação do nosso Lar", width / 2, 180);

  textSize(18);
  text("Lucas Silva - 1ºA", width / 2, 220);

  textSize(16);
  text("Clique nas árvores para cortá-las e construir casas.\nQuando não houver mais floresta, algo mudará...\n\nPressione [ESPAÇO] para começar!", width / 2, 300);
}

function keyPressed() {
  if (!jogoIniciado && key === ' ') {
    jogoIniciado = true;
  }
}
