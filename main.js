let camera = new Camera();
let cat = new Object3D();
cat.mesh = Mesh.cat_lpoly;
cat.scale.multiply(3);
let stage = new Object3D();
stage.mesh = Mesh.cylinder;
stage.scale = new Vector(3, 0.2, 3);
stage.position.y = -1.6;

let speed = .25;
let amp = 6;

let angle = 0;

function update() {
	camera.position = new Vector(Math.sin(angle * speed) * amp, Math.cos(angle * speed * 1.7) * 2 + 0.5, Math.cos(angle * speed) * amp);
	camera.look(Vector.substract(cat.position, camera.position));

	angle += Math.PI / 180;
	render(camera);
}
