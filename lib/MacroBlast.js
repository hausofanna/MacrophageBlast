
/* 
lifes 
KillPoints
BulletLifeSpan 
BCells
*/

var GameStats = {
  lifes : 0,
  KillPoints : 0,
  BulletLifeSpan : 0,
  BCells : 0,
  BulletRatio : 0,
  ResetStatsJson : function(){
    this.KillPoints=0;
    this.lifes = JsonConfig.LifeRespawns;
    this.BulletRatio = JsonConfig.bRatio;
    this.BulletLifeSpan = JsonConfig.bLifeSpan;
    this.BCells = JsonConfig.BadCells;

  },
  IncreaseLife : function(){
    this.KillPoints = this.KillPoints + this.lifes;
  },
  DecreaseLife : function(){
    this.lifes--;
  }
};

var bullets;
var Macro_Cellseroids;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN ;
var cnv;
//var lifes;
//var KillPoints;
//var BCells;
var JsonConfig;
var s1;
var s2;
//var BulletLifeSpan;
var BulletRatio;
var StartImg;
var WebPoints;
var WebLifes;

//Screen auto resize
function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = 0;//(windowHeight - height) / 2;
  cnv.position(x, y);

  cnv = createCanvas(windowWidth / 2, windowHeight / 2);
}



//Load JSon config
function preload() {
  let url = 'config/config.json';
  JsonConfig = loadJSON(url);

}
//Create a controlable ShipCell
function createShip() {
  shipImage = loadImage('media/Macro_Cells/Player_Cell.png');
  ship = createSprite(width / 2, height / 2);
  ship.maxSpeed = 6;
  ship.friction = 0.02;
  ship.setCollider('circle', 0, 0, 10);

  ship.addImage('normal', shipImage);
  ship.addAnimation('thrust', 'media/Macro_Cells/Player_Cell2.png', 'media/Macro_Cells/Player_Cell.png', 'media/Macro_Cells/Player_Cell3.png');
}
//Create  n of  bad cells |n=BCells|
function createCells() {

  for (var i = 0; i < GameStats.BCells; i++) {
    var ang = random(360);
    var px = width / 2 + 1000 * cos(radians(ang));
    var py = height / 2 + 1000 * sin(radians(ang));
    createMacro_Cellseroid(3, px, py);
  }

}


//Adding  type of bad cell in the array 
function createMacro_Cellseroid(type, x, y) {
  var a = createSprite(x, y);
  var img = loadImage('media/Macro_Cells/Bad_Cell' + floor(random(0, 3)) + '.png');
  a.addImage(img);
  a.setSpeed(2.5 - (type / 2), random(360));
  a.rotationSpeed = 0.5;

  a.type = type;

  if (type == 2)a.scale = 0.9;
  if (type == 1)a.scale = 0.7;

  a.mass = 2 + a.scale;
  a.setCollider('circle', 0, 0, 20);
  Macro_Cellseroids.add(a);
  return a;
}

// hit betwen ShipCell vs BadCell
// Calculate lives of ShipCell
function Ship_Hit(ship, bullet) {


  for (var i = 0; i < 10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(particleImage);
    p.setSpeed(random(3, 5), random(360));
    p.friction = 0.05;
    p.life = 15;
  }
  if (GameStats.lifes > 0) GameStats.DecreaseLife();
  bullet.remove();

  if (GameStats.lifes <= 0) {

    ship.remove();

    bullet.remove();
    Macro_Cellseroids.removeSprites();
   

    createShip();
  }
  WebLifes.innerHTML = GameStats.lifes;
}




//Hit betwen BadCell and Bullet
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
    p.life = 10;
  }
  GameStats.IncreaseLife();
  
  bullet.remove();
  Macro_Cellseroid.remove();
  s2.play();
  CurrentBCells();
  WebPoints.innerHTML=GameStats.KillPoints;
}


function LoadSoundsFX() {
  soundFormats('mp3');
  s1 = loadSound('media/Sounds/BulletShoot.mp3');
  s2 = loadSound('media/Sounds/CellRemove.mp3');
  s1.playMode('restart');
  s2.playMode('sustain');
  s1.setVolume(0.3);
  s2.setVolume(10.0);
}
//Calculate Current bad cells
//Increase lifes
//Increase Bad Cells on next wave
//Increase  BulletLifeSpan
function CurrentBCells() {
  if (Macro_Cellseroids.length <= 0) {


    GameStats.BCells++;
    GameStats.lifes++;
    GameStats.BulletLifeSpan++;
    WebLifes.innerHTML = GameStats.lifes;
    createCells();
    
  }


}


function setup() {

  MARGIN = 10;
  GameStats.lifes = 0;
  GameStats.KillPoints = 0;
  GameStats.BulletLifeSpan = JsonConfig.bLifeSpan;
  GameStats.BulletRatio = JsonConfig.bRatio;
  GameStats.BCells = JsonConfig.BadCells;
  cnv = createCanvas(windowWidth / 2, windowHeight / 2);
  WebPoints = document.getElementById("score");
  WebLifes = document.getElementById("life");
 
  
  centerCanvas();

  bulletImage = loadImage('media/Macro_Cells/shoot.png');

  particleImage = loadImage('media/Macro_Cells/shoot.png');

  StartImg = loadImage('media/Buttons/play.png');


  Macro_Cellseroids = new Group();
  bullets = new Group();
  createShip();

  LoadSoundsFX();
}

function draw() {
  centerCanvas();
  background(0);

  fill(255);
  textAlign(CENTER);
  /*text('Lifes' + lifes, width / 2, 20);
  text('Points' + KillPoints, width / 2, 40);*/

  for (var i = 0; i < allSprites.length; i++) {
    var s = allSprites[i];
    if (s.position.x < -MARGIN) s.position.x = width + MARGIN;
    if (s.position.x > width + MARGIN) s.position.x = -MARGIN;
    if (s.position.y < -MARGIN) s.position.y = height + MARGIN;
    if (s.position.y > height + MARGIN) s.position.y = -MARGIN;
  }

  //Intersection between Bullets and BadCells
  Macro_Cellseroids.overlap(bullets, Macro_CellseroidHit);

  //Colision Betwen Ship and Bad Cells
  ship.bounce(Macro_Cellseroids, Ship_Hit);

  //Player to CellShip Controls
  if (GameStats.lifes > 0) {
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



      if (frameCount % GameStats.BulletRatio == 0) {


        var bullet = createSprite(ship.position.x, ship.position.y);
        bullet.addImage(bulletImage);
        bullet.setSpeed(10 + ship.getSpeed(), ship.rotation);
        bullet.life = GameStats.BulletLifeSpan;
        bullets.add(bullet);
        s1.play();
      }

    }
  }
  //Start and Reset
  else if (GameStats.lifes <= 0) {

    image(StartImg, width / 2.7, height / 5 );
    //text('Pres R to Start', width / 2, height / 2 + 50);

    

    if (keyDown('R')) {
      GameStats.ResetStatsJson();
      WebLifes.innerHTML = GameStats.lifes;
      WebPoints.innerHTML = GameStats.KillPoints;
      createCells();
    }
  }

  drawSprites();

}
