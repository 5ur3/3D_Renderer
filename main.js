let camera = new Camera();
camera.position.z = -20;
let cat = new Object3D();
cat.mesh = Mesh.cat_lpoly;
cat.scale.multiply(3);
cat.rotation.y = 180;
let stage = new Object3D();
stage.mesh = Mesh.cylinder;
stage.scale = new Vector(3, 0.2, 3);
stage.center.y = 1.6;

let speed = 1;

let mouse_last = 0;
let mouse_down = 0;
let lerp_rotation = cat.rotation;
let lerp_position = camera.position.z;

function onMouseDown(mouse) {
	mouse_down = 1;
}
function onMouseMove(mouse) {
	if (mouse_down && mouse_last)
		lerp_rotation.add(new Vector((-(mouse.y - mouse_last.y)) / canvas.height * 360, (mouse.x - mouse_last.x) / canvas.width * 360));
	mouse_last = new Vector(mouse.x, mouse.y);
}
function onMouseUp(mouse) {
	mouse_last = 0;
	mouse_down = 0;
}

function onMouseWheel(wheel) {
	lerp_position -= wheel.y / 3;
}

function update() {
	cat.rotation = Vector.lerp(cat.rotation, lerp_rotation, speed);
	stage.rotation = Vector.lerp(stage.rotation, lerp_rotation, speed);
	camera.look(Vector.substract(cat.position, camera.position));
	camera.position.z = lerp(camera.position.z, lerp_position, speed / 10);

	render(camera);
}
