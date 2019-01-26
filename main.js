let camera = new Camera();
let cat = new Object3D();
cat.scale.multiply(3);
cat.mesh = Mesh.cat_lpoly;
let stage = new Object3D();
stage.mesh = Mesh.cube;
stage.scale = new Vector(3, 0.1, 3);
stage.position.y = -1.55;
for (let i = 0; i < 2; i++) {
	for (let j = 0; j < 2; j++) {
		let corner = new Object3D();
		corner.scale = new Vector(0.5, 1, 0.5);
		corner.position.x = (i - 0.5) * (stage.scale.x - corner.scale.x);
		corner.position.z = (j - 0.5) * (stage.scale.z - corner.scale.z);
		corner.position.y = corner.scale.y / 2 - 1.5;
	}
}

let speed = 0.5;
let amp = 7;

let angle = 0;
function update() {
	camera.position = new Vector(Math.sin(angle * speed) * amp, Math.cos(angle * speed * 1.7) * 2 + 0.5, Math.cos(angle * speed) * amp);
	camera.look(Vector.substract(Vector.add(cat.position, new Vector(0, 0, 0)), camera.position));

	angle += Math.PI / 180;
	render(camera);
}
