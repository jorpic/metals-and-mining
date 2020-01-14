import {
  World, Bodies
} from "matter-js";


export class OreSource {
  constructor(engine, x, y, {delay, size}) {
    Object.assign(this, {x, y, delay, size});
    this.lastCreation = 0;
    this.engine = engine;
    this.enabled = false;
  }

  tick(e, key) {
    if(this.enabled && e.timestamp - this.lastCreation > this.delay) {
      this.lastCreation = e.timestamp;
      const poly = (sz, color) => Bodies.polygon(
        this.x, this.y, 7, sz, {render: {fillStyle: color}});
      const obj = Math.random() > 0.8
        ? poly(this.size*2, "#ffb612")
        : poly(this.size*3, "#333");
      World.add(this.engine.world, obj);
    }
  }
}

export default OreSource;
