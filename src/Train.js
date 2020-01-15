import {
  World,
  Body, Bodies, Constraint, Composite,
  Vertices
} from "matter-js";


class Car {
  constructor(x, y) {
    this.composite = Composite.create({label: "oreCar"});
    this.body = this.__addParts(this.composite, x, y);
  }

  width() {
    return this.body.bounds.max.x - this.body.bounds.min.x;
  }

  position() {
    return this.body.position;
  }

  __addParts(composite, x, y) {
    const group = Body.nextGroup(true);
    const opt = {
      collisionFilter: {group},
      // chamfer: {radius: size},
      render: {fillStyle: "#222"}
    };

    const vertices = Vertices.fromPath([
      "M 0 0 L 6 0 L 18  30 L 60 30",
      "L 69 0 L 75 0 L 63 36 L 15 36 Z"
    ].join(" "));
    const body = Bodies.fromVertices(x, y, vertices, opt);
    Composite.addBody(composite, body);

    for (let k of [1, -1]) {
      const dx = k*15;
      const dy = 12;
      const wheel = Bodies.circle(x + dx, y + dy, 9, opt);
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
  constructor(engine, x, y) {
    this.length = 1;
    this.composite = Composite.create({label: "oreTrain"});
    this.head = new Car(x, y);
    Composite.add(this.composite, this.head.composite);
    World.add(engine.world, this.composite);
  }

  addCar() {
    const width = this.head.width();
    const {x, y} = this.head.position();
    const carB = new Car(x - width, y);
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

  width() { return this.length * this.head.width(); }

  move(dir) { Body.setVelocity( this.head.body, {x: 1.5*dir, y: 0}); }

  tick(e, key) {
    if(key.ArrowUp) { this.addCar(); key.ArrowUp = false; }
    if(key.ArrowLeft) this.move(-1);
    if(key.ArrowRight) this.move(1);
  }
}

export default Train;
