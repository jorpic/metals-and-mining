import decomp from "poly-decomp";
window.decomp = decomp;

import {
  World, Engine, Events, Render,
  Body, Bodies, Constraint, Composite,
  Vertices
} from "matter-js";
import heroImg from "./hero.png";


const width = window.innerWidth * 0.98;
const height = window.innerHeight * 0.98;
const engine = Engine.create();
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width, height,
    wireframes: false,
    showAngleIndicator: false,
    background: "fff"
  }
});


class Car {
  constructor(x, y, size) {
    this.composite = Composite.create({label: "oreCar"});
    this.body = this.__addParts(this.composite, x, y, size);
  }


  width() {
    return this.body.bounds.max.x - this.body.bounds.min.x;
  }

  position() {
    return this.body.position;
  }

  __addParts(composite, x, y, size) {
    const group = Body.nextGroup(true);
    const opt = {
      collisionFilter: {group},
      chamfer: {radius: size},
      render: {fillStyle: "#222"}
    };

    const vertices = Vertices.fromPath([
      `M 0 0 L ${size*2} 0`,
      `L ${size*6}  ${size*10} L ${size*20} ${size*10}`,
      `L ${size*23} 0          L ${size*25} 0`,
      `L ${size*21} ${size*12} L ${size*5}  ${size*12} Z`
    ].join(" "));
    const body = Bodies.fromVertices(x, y, vertices, opt);
    Composite.addBody(composite, body);

    for (let k of [1, -1]) {
      const dx = k*size*5;
      const dy = size*4;
      const wheel = Bodies.circle(x + dx, y + dy, size*3, opt);
      Composite.addBody(composite, wheel);
      Composite.addConstraint(
        composite,
        Constraint.create({
          bodyA: body,
          bodyB: wheel,
          pointA: {x: dx, y: dy},
          render: {visible: false}
        })
      );
    }

    return body;
  }
}


class Train {
  constructor(x, y, size) {
    this.length = 1;
    this.size = size;
    this.composite = Composite.create({label: "oreTrain"});
    this.head = new Car(x, y, size);
    Composite.add(this.composite, this.head.composite);
  }

  addCar() {
    const width = this.head.width();
    const {x, y} = this.head.position();
    const carB = new Car(x + width, y, this.size);
    Composite.add(this.composite, [
      carB.composite,
      Constraint.create({
        bodyA: this.head.body,
        bodyB: carB.body,
        length: width,
        stifness: 0.5,
        render: {visible: false}
      })
    ]);
    this.head = carB;
    this.length += 1;
  }

  move(x, y = 0) {
    Body.applyForce(this.body, this.body.position, {
      x: 0.0001 * x * this.length * this.size,
      y});
  }

  tick(e, key) {
    if(key.ArrowUp) { this.addCar(); key.ArrowUp = false; }
    if(key.ArrowLeft) this.move(-1);
    if(key.ArrowRight) this.move(1);
  }
}


class Hero {
  constructor(x, y) {
    console.log(heroImg);
    const heroW = 206, heroH = 287, heroScale = 0.2;
    this.body = Bodies.rectangle(
      x, y, heroW*heroScale, heroH*heroScale,
      { frictionAir: 0.2,
        render: {
          sprite: {
            texture: heroImg,
            xScale: heroScale,
            yScale: heroScale,
          }}
      });
  }

  move(x, y = 0) {
    Body.applyForce(this.body, this.body.position, {x: 0.002*x, y: 0.005*y});
  }

  tick(e, key) {
    Body.setAngle(this.body, 0);
    if(key.KeyA) this.move(-1);
    if(key.KeyD) this.move(1);
    // FIXME: if touches ground
    if(key.KeyW) { this.move(0, -1); key.KeyW = false; }
  }
}


const size = 3;
const train = new Train(100, 700, size);
World.add(engine.world, train.composite);

const hero = new Hero(400, 750);
World.add(engine.world, hero.body);

const key = {};
document.addEventListener("keydown", e => key[e.code] = true);
document.addEventListener("keyup", e => key[e.code] = false);
document.addEventListener("mousedown", e => key.MouseBtn = {x: e.x, y: e.y});

Events.on(engine, "beforeTick", e => {
  train.tick(e, key);
  hero.tick(e, key);
  if(key.MouseBtn) {
    const {x, y} = key.MouseBtn;
    key.MouseBtn = null;
    World.add(engine.world, Bodies.polygon(x, y, 7, size*3));
  }
});


const ground = Bodies.rectangle(
  width/2, height*0.95, width, 30,
  {isStatic: true});
Body.rotate(ground, Math.PI*0.01);
World.add(engine.world, ground);

Engine.run(engine);
Render.run(render);
