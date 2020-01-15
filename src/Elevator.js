import {
  World, Body, Bodies, Composite
} from "matter-js";


export class Elevator {
  constructor(engine, {x, y, width, height}) {
    Object.assign(this, {x, y, width, height});

    const walls = Composite.create({label: "elevator"});
    Composite.add(walls, [
      Bodies.rectangle(x, y+20, 20, 20, {isStatic: true}),
      Bodies.rectangle(x, y-height, 20, 20, {isStatic: true}),
    ]);
    World.add(engine.world, walls);

    const opt = {
      render: {fillStyle: "#444"}
    };
    this.body = Bodies.rectangle(x, y, width, 20, opt);
    World.add(engine.world, this.body);
  }

  tick(e, key) {
    Body.setAngle(this.body, 0);
    if(key.KeyR) {
      Body.setVelocity(this.body, {x: 0, y: -2});
    }
    if(key.KeyF) this.move(1);
  }
}

export default Elevator;
