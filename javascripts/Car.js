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

    this.damaged = false;

    this.handbrakeDeceleration = 0.1;

    this.controls = new Controls();

    this.sensor = new Sensor(this);
  }

  draw(context) {
    if (this.damaged) context.fillStyle = "gray";
    else context.fillStyle = "black";

    context.beginPath();
    context.moveTo(this.polygon[0].x, this.polygon[0].y);

    for (let i = 1; i < this.polygon.length; i++)
      context.lineTo(this.polygon[i].x, this.polygon[i].y);

    context.fill();

    this.sensor.draw(context);
  }

  update(roadBorders) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders);
    }

    this.sensor.update(roadBorders);
  }

  #assessDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++)
      if (polysIntersect(this.polygon, roadBorders[i])) return true;

    return false;
  }

  #createPolygon() {
    const points = [];

    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });

    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });

    return points;
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
