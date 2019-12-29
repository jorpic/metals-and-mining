
import {
  World, Body, Bodies
} from "matter-js";

import heroImg from "../img/hero.png";


class Hero {
  constructor(engine, x, y) {
    const heroW = 206, heroH = 287, heroScale = 0.2;
    this.body = Bodies.rectangle(
      x, y, heroW*heroScale, heroH*heroScale,
      { frictionAir: 0.1,
        render: {
          sprite: {
            texture: heroImg,
            xScale: heroScale,
            yScale: heroScale,
          }}
      });
    World.add(engine.world, this.body);
  }

  move(x, y = 0) {
    Body.applyForce(
      this.body,
      this.body.position,
      {x: 0.004*x, y: 0.05*y});
  }

  tick(e, key) {
    Body.setAngle(this.body, 0);
    if(key.KeyA) this.move(-1);
    if(key.KeyD) this.move(1);
    // FIXME: if touches ground
    if(key.KeyW) { this.move(0, -1); key.KeyW = false; }
  }
}

export default Hero;
