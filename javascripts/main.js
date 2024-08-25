const canvas = document.querySelector("canvas");

canvas.width = 200;

const context = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);

const car = new Car(road.getLaneCenter(), 100, 30, 50);

const animate = () => {
  car.update(road.borders);

  canvas.height = window.innerHeight;

  context.save();
  context.translate(0, -car.y + canvas.height * 0.7);

  road.draw(context);
  car.draw(context);

  context.restore();

  requestAnimationFrame(animate);
};

animate();

// 1:10:30 ... https://www.youtube.com/watch?v=Rs_rAxEsAvI&t=3083s
