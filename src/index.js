import decomp from "poly-decomp";
window.decomp = decomp;

import {
  World, Engine, Events, Render,
  Body, Bodies, Constraint, Composite,
  Vertices
} from "matter-js";

import Train from "./Train";
import Hero from "./Hero";
import OreSource from "./OreSource";
import Elevator from "./Elevator";


const width = 1000;
const height = 600;
const element = document.getElementById("matter");
element.focus();
const engine = Engine.create();
const render = Render.create({
  element, engine,
  options: {
    width, height,
    wireframes: false,
    showAngleIndicator: false,
    background: "fff"
  }
});

const ELEVATOR_WIDTH = 300;
function ground(x, y, w, angle) {
  const rect = Bodies.rectangle(x + w/2, y, w, 20, {isStatic: true});
  Body.rotate(rect, Math.PI*angle);
  World.add(engine.world, rect);
}

World.add(engine.world, Bodies.rectangle(-10, height/2, 20, height, {isStatic: true}));
World.add(engine.world, Bodies.rectangle(width+10, height/2, 20, height, {isStatic: true}));
ground(+ELEVATOR_WIDTH, height*0.2, width-ELEVATOR_WIDTH, +0.01);
ground(+ELEVATOR_WIDTH, height*0.4, width-2*ELEVATOR_WIDTH, 0.00);
ground(0, height*0.6, width-ELEVATOR_WIDTH, -0.01);
ground(0, height, width, -0.0);

const train = new Train(engine, 100, height*0.18);
const oreSource = new OreSource({engine, x: 100, y: height*0.45, delay: 900});
const objects = [
  train,
//  new Hero(engine, 400, height*0.2),
  new Elevator(engine, {x: 0, y: height*0.4, width: ELEVATOR_WIDTH, height: 250}),
  new Elevator(engine, {x: width-100, y: height*0.6-27, width: ELEVATOR_WIDTH, height: 200}),
  oreSource
];

const key = {};
document.addEventListener("keydown", e => key[e.code] = true);
document.addEventListener("keyup", e => key[e.code] = false);
document.addEventListener("mousedown", e => key.MouseBtn = {x: e.x, y: e.y});
Events.on(engine, "beforeTick", e => {
  objects.forEach(o => o.tick(e, key))
  const {x, y} = train.head.position();
  oreSource.enabled = x < 100 && y > height/2;
  oreSource.width = train.width();
});

Engine.run(engine);
Render.run(render);
