class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;
    this.rotation = 0.03;

    this.handbrakeDeceleration = 0.1;

    this.controls = new Controls();

    this.sensor = new Sensor(this);
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(-this.angle);
    context.beginPath();
    context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.fill();
    context.restore();

    this.sensor.draw(context);
  }

  update(roadBorders) {
    this.#move();
    this.sensor.update(roadBorders);
  }

  #move() {
    if (!this.controls.handbrake) {
      if (this.controls.up) this.speed += this.acceleration;
      if (this.controls.down) this.speed -= this.acceleration;
    }

    if (this.speed != 0) {
      let flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) this.angle += this.rotation * flip;
      if (this.controls.right) this.angle -= this.rotation * flip;
    }

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;

    if (this.controls.handbrake) {
      if (this.speed > 0) {
        this.speed -= this.handbrakeDeceleration;
      } else if (this.speed < 0) {
        this.speed += this.handbrakeDeceleration;
      }
    } else {
      if (this.speed > 0) this.speed -= this.friction;
      if (this.speed < 0) this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}
