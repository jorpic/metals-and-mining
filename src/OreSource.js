import {
  World, Bodies
} from "matter-js";


export class OreSource {
  constructor(args = {engine, x, y, delay, size}) {
    Object.assign(this, args);
    this.lastCreation = 0;
    this.enabled = false;
    this.width = 0;
  }

  tick(e, key) {
    if(this.enabled && e.timestamp - this.lastCreation > this.delay) {
      this.lastCreation = e.timestamp;
      const poly = (sz, color) => Bodies.polygon(
        this.x + this.width*(Math.random() - 0.5),
        this.y, 7, sz, {render: {fillStyle: color}});
      const obj = Math.random() > 0.8
        ? poly(this.size*2, "#ffb612")
        : poly(this.size*3, "#333");
      World.add(this.engine.world, obj);
    }
  }
}

export default OreSource;
