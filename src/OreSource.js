import {
  World, Bodies
} from "matter-js";


export class OreSource {
  constructor(engine, x, y, {freq, size}) {
    Object.assign(this, {x, y, freq, size});
    this.lastCreation = 0;
    this.engine = engine;
  }

  tick(e, key) {
    if(e.timestamp - this.lastCreation > this.freq) {
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
