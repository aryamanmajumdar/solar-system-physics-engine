let sun;
let planets = [];
let G = 8;
let numPlanets = 5;
let destabilise = 0.2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //create sun
  sun = new Body(100, createVector(0,0), createVector(0,0));
  
  for(let i = 0; i < numPlanets; i++){
      //create planet in random position
  let r = random(sun.r + 50, min(windowWidth/2, windowHeight/2));
  let theta = random(TWO_PI);
  let planetPos = createVector(r*cos(theta), r*sin(theta)));
  
  //and an appropriate velocity
  //so that it stays in sun's orbit
  
  let planetVel = planetPos.copy();
  planetVel.rotate(HALF_PI);          planetVel.setMag(sqrt(G*sun.mass/planetPos.mag()));
    
    if(random(1) < 0.2){
      planetVel.mult(-1);
    }
    
  planetVel.mult(random(1-destabilise, 1 + destabilise));
  planets.push(new Body(random(5,30), planetPos, planetVel));
  }

  

}

function draw() {
  translate(width/2, height/2);
  background(180);
  for(let i = 0; i < planets.length; i++){
    sun.attract(planets[i]);
    planets[i].update();
    planets[i].show();
  }

  sun.show();
  
}

function Body(_mass, _pos, _vel){
  this.mass = _mass;
  this.pos = _pos;
  this.vel = _vel;
  
  this.r = this.mass;
  
  this.path = [];
  
  this.show = function(){
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
    
    //draw path
    stroke(30);
    for(let i = 0; i < this.path.length - 2; i++){
      line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y);
    }
    
  }
  
      this.update = function(){
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.path.push(this.pos.copy());
        
      if(this.path.length > 100){
        this.path.splice(0,1);
      }
    }
  
  this.applyForce = function(f){
    this.vel.x += f.x / this.mass;
    this.vel.y += f.y / this.mass;
  }
  
  this.attract = function(child){
    let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y);
    
    let f = this.pos.copy().sub(child.pos);
    
    f.setMag(G * this.mass * child.mass / (r*r));
    child.applyForce(f);
  }
}
