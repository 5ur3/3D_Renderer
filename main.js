let camera = new Camera();
let cat = new Object3D();
cat.mesh = Mesh.cat_lpoly;
cat.scale.multiply(0.034);
let stage = new Object3D();
stage.mesh = Mesh.cylinder;
stage.scale = new Vector(0.03, 0.001, 0.03);
stage.position.y = -1.7;


let speed = 0.5;
let amp = 7;

let angle = 0;
function update() {
	camera.position = new Vector(Math.sin(angle * speed) * amp, Math.cos(angle * speed * 1.7) * 2 + 0.5, Math.cos(angle * speed) * amp);
	camera.look(Vector.substract(Vector.add(stage.position, new Vector(0, 2, 0)), camera.position));

	angle += Math.PI / 180;
	render(camera);
}