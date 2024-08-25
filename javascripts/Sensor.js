class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  draw(context) {
    for (let i = 0; i < this.rayCount; i++) {
      const currentRay = this.rays[i];

      let end = currentRay[1];
      let reading = this.readings[i];

      if (reading) end = reading;

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "yellow";
      context.moveTo(currentRay[0].x, currentRay[0].y);
      context.lineTo(end.x, end.y);
      context.stroke();

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.moveTo(currentRay[1].x, currentRay[1].y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }
  }

  update(roadBorders) {
    this.#castRays();

    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings[i] = this.#getReadings(this.rays[i], roadBorders);
    }
  }

  #castRays() {
    this.rays = [];

    const car = this.car;
    const rayLength = this.rayLength;

    for (let i = 0; i < this.rayCount; i++) {
      const halfRaySpread = this.raySpread / 2;
      const rayAngle =
        lerp(
          halfRaySpread,
          -halfRaySpread,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + car.angle;

      const start = { x: car.x, y: car.y };
      const end = {
        x: car.x - Math.sin(rayAngle) * rayLength,
        y: car.y - Math.cos(rayAngle) * rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  #getReadings(ray, roadBorders) {
    let touches = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const currentRoadBorder = roadBorders[i];

      const touch = getIntersection(
        ray[0],
        ray[1],
        currentRoadBorder[0],
        currentRoadBorder[1]
      );

      if (touch) touches.push(touch);
    }

    if (touches.length === 0) return null;
    else {
      const offsets = touches.map((element) => element.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((element) => element.offset === minOffset);
    }
  }
}
