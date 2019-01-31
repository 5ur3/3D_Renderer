let camera = new Camera();
let cube1 = new Object3D();
let cube2 = new Object3D();

let speed = 1;
let amp = 10;

let angle = 0;
function update() {
	camera.position = new Vector(Math.sin(angle * speed) * amp, Math.cos(angle * speed * 1.7) * 2 + 0.5, Math.cos(angle * speed) * amp);
	cube1.rotation.add(new Vector(0.1, 3, 0));
	camera.look(Vector.substract(cube1.position, camera.position));

	angle += Math.PI / 180;
	render(camera);
}
