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


const size = 3;
const objects = [
  new Train(engine, 100, 700, size),
  new Hero(engine, 400, 750),
  new OreSource(engine, 200, 400, {freq: 700, size})
];

const key = {};
document.addEventListener("keydown", e => key[e.code] = true);
document.addEventListener("keyup", e => key[e.code] = false);
document.addEventListener("mousedown", e => key.MouseBtn = {x: e.x, y: e.y});
Events.on(engine, "beforeTick", e => objects.forEach(o => o.tick(e, key)));

const ground = Bodies.rectangle(
  width/2, height*0.95, width, 30,
  {isStatic: true});
Body.rotate(ground, Math.PI*0.01);
World.add(engine.world, ground);

Engine.run(engine);
Render.run(render);
