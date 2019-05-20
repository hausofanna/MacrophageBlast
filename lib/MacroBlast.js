


var bullets;
var Macro_Cellseroids;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var cnv;
var lifes;
var KillPoints;
var killStreak;
var JsonConfig;
var s1;
var s2;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = 0;//(windowHeight - height) / 2;
  cnv.position(x, y);

  cnv = createCanvas(windowWidth / 2, windowHeight / 2);
}

function windowResized() {
  centerCanvas();
}


function preload() {
  let url = 'config/config.json';
  JsonConfig = loadJSON(url);

}

function createShip() {
  shipImage = loadImage('media/Macro_Cells/Player_Cell.png');
  ship = createSprite(width / 2, height / 2);
  ship.maxSpeed = 6;
  ship.friction = 0.02;
  ship.setCollider('circle', 0, 0, 10);

  ship.addImage('normal', shipImage);
  ship.addAnimation('thrust', 'media/Macro_Cells/Player_Cell2.png', 'media/Macro_Cells/Player_Cell.png', 'media/Macro_Cells/Player_Cell3.png', 'media/Macro_Cells/Player_Cell.png');
}
function createCells() {

  for (var i = 0; i < JsonConfig.BadCells; i++) {
    var ang = random(360);
    var px = width / 2 + 1000 * cos(radians(ang));
    var py = height / 2 + 1000 * sin(radians(ang));
    createMacro_Cellseroid(3, px, py);
  }

}



function createMacro_Cellseroid(type, x, y) {
  var a = createSprite(x, y);
  var img = loadImage('media/Macro_Cells/Bad_Cell' + floor(random(0, 3)) + '.png');
  a.addImage(img);
  a.setSpeed(2.5 - (type / 2), random(360));
  a.rotationSpeed = 0.5;
  //a.debug = true;
  a.type = type;

  if (type == 2)
    a.scale = 0.9;
  if (type == 1)
    a.scale = 0.7;

  a.mass = 2 + a.scale;
  a.setCollider('circle', 0, 0, 20);
  Macro_Cellseroids.add(a);
  return a;
}


function Ship_Hit(ship, bullet) {


  for (var i = 0; i < 10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(particleImage);
    p.setSpeed(random(3, 5), random(360));
    p.friction = 0.05;
    p.life = 15;
  }
  if (lifes > 0) lifes--;
  bullet.remove();

  if (lifes <= 0) {
    //Macro_Cellseroids.remove();
    ship.remove();

    bullet.remove();



    createShip();
  }
}





function Macro_CellseroidHit(Macro_Cellseroid, bullet) {
  var newType = Macro_Cellseroid.type - 1;

  if (newType > 0) {
    createMacro_Cellseroid(newType, Macro_Cellseroid.position.x, Macro_Cellseroid.position.y);
    createMacro_Cellseroid(newType, Macro_Cellseroid.position.x, Macro_Cellseroid.position.y);
  }

  for (var i = 0; i < 10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(particleImage);
    p.setSpeed(random(3, 5), random(360));
    p.friction = 0.05;
    p.life = 15;
  }
  KillPoints++;
  bullet.remove();
  Macro_Cellseroid.remove();
  s2.play();
}


function LoadSoundsFX() {
  soundFormats('mp3', 'ogg','wav');
  s1 = loadSound('media/sounds/BulletShoot.mp3');
  s2 = loadSound('media/sounds/CellRemove.mp3');
  s1.playMode('restart');
  s2.playMode('sustain');
  s1.setVolume(0.3);
  s2.setVolume(10.0);
}



function setup() {

  //ReadConfigJson();
  lifes = JsonConfig.LifeRespawns;
  KillPoints = 0;

  cnv = createCanvas(windowWidth / 2, windowHeight / 2);
  centerCanvas();

  bulletImage = loadImage('media/Macro_Cells/shoot.png');

  particleImage = loadImage('media/Macro_Cells/shoot.png');



  Macro_Cellseroids = new Group();
  bullets = new Group();
  createShip();
  createCells();
  LoadSoundsFX();
}

function draw() {
  windowResized();
  background(0);

  fill(255);
  textAlign(CENTER);
  text('Lifes' + lifes, width / 2, 20);
  text('Points' + KillPoints, width / 2, 40);

  for (var i = 0; i < allSprites.length; i++) {
    var s = allSprites[i];
    if (s.position.x < -MARGIN) s.position.x = width + MARGIN;
    if (s.position.x > width + MARGIN) s.position.x = -MARGIN;
    if (s.position.y < -MARGIN) s.position.y = height + MARGIN;
    if (s.position.y > height + MARGIN) s.position.y = -MARGIN;
  }

  Macro_Cellseroids.overlap(bullets, Macro_CellseroidHit);


  ship.bounce(Macro_Cellseroids, Ship_Hit);

  if (lifes > 0) {
    if (keyDown(LEFT_ARROW))
      ship.rotation -= 4;
    if (keyDown(RIGHT_ARROW))
      ship.rotation += 4;
    if (keyDown(UP_ARROW)) {
      ship.addSpeed(0.2, ship.rotation);
      ship.changeAnimation('thrust');
    }
    else
      ship.changeAnimation('normal');

    if (keyDown('space')) {



      if (frameCount % 10 == 0) {


        var bullet = createSprite(ship.position.x, ship.position.y);
        bullet.addImage(bulletImage);
        bullet.setSpeed(10 + ship.getSpeed(), ship.rotation);
        bullet.life = 30;
        bullets.add(bullet);
        s1.play();
      }

    }
  }
  else if (lifes <= 0) {

    text('Pres R to restart', width / 2, height / 2 + 50);



    if (keyDown('r')) {
      lifes = 3;

      createCells();
    }
  }

  drawSprites();

}
