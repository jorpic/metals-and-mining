import {
  World,
  Body, Bodies, Constraint, Composite,
  Vertices
} from "matter-js";


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
  constructor(engine, x, y, size) {
    this.length = 1;
    this.size = size;
    this.composite = Composite.create({label: "oreTrain"});
    this.head = new Car(x, y, size);
    Composite.add(this.composite, this.head.composite);
    World.add(engine.world, this.composite);
  }

  addCar() {
    const width = this.head.width();
    const {x, y} = this.head.position();
    const carB = new Car(x - width, y, this.size);
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

  move(x, y = 0) {
    Body.applyForce(this.head.body, this.head.position(), {
      x: 0.0001 * x * this.length * this.size,
      y});
  }

  tick(e, key) {
    if(key.ArrowUp) { this.addCar(); key.ArrowUp = false; }
    if(key.ArrowLeft) this.move(-1);
    if(key.ArrowRight) this.move(1);
  }
}

export default Train;
