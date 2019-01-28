let camera = new Camera();
let stage = new Object3D();
stage.mesh = Mesh.cylinder;
stage.scale = new Vector(3, 0.1, 3);
stage.position.y = -1.55;
let cat = new Object3D();
cat.scale.multiply(3);
cat.mesh = Mesh.cat_lpoly;

let speed = .5;
let amp = 7;

let angle = 0;
function update() {
	camera.position = new Vector(Math.sin(angle * speed) * amp, Math.cos(angle * speed * 1.7) * 2 + 0.5, Math.cos(angle * speed) * amp);
	camera.look(Vector.substract(cat.position, camera.position));

	angle += Math.PI / 180;
	render(camera);
}
