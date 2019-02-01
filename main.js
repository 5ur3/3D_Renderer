let camera = new Camera();
camera.position.z = -7;

// сцена 1
let cube1 = new Object3D();
cube1.mesh = Mesh.cube;
cube1.position.x = -3;
cube1.color = new Vector(1, 0, 0);
let pyramid1 = new Object3D();
pyramid1.mesh = Mesh.pyramid;
pyramid1.position.x = -1;
pyramid1.color = new Vector(0, 1, 0);
let sphere1 = new Object3D();
sphere1.mesh = Mesh.sphere;
sphere1.position.x = 1;
sphere1.color = new Vector(0, 0, 1);
let cylinder1 = new Object3D();
cylinder1.mesh = Mesh.cylinder;
cylinder1.position.x = 3;
cylinder1.color = new Vector(1, 1, 0);
// сцена 2
let cube2_1 = new Object3D();
cube2_1.enabled = 0;
cube2_1.color = new Vector(0.3, 0.3, 1);
let cube2_2 = new Object3D();
cube2_2.enabled = 0;
cube2_2.color = new Vector(1, 0.3, 0.3);
// сцена 3
let cat3 = new Object3D();
cat3.enabled = 0;
cat3.mesh = Mesh.cat_lpoly;
cat3.rotation.y = 180;
let stage3 = new Object3D();
stage3.enabled = 0;
stage3.mesh = Mesh.cylinder;
stage3.scale.y = 0.06;
stage3.center.y = 0.53;
//сцена 4
let deer4 = new Object3D();
deer4.enabled = 0;
deer4.mesh = Mesh.deer;

let speed = 0.1;

let mouse_last = 0;
let mouse_down = 0;
let lerp_rotation = cat3.rotation;
let lerp_position = camera.position.z;

function onMouseDown(mouse) {
	if (mouse.y > canvas.height - 30) {
		for (let i = 1; i <= 4; i++) {
			if (mouse.x > 50 + i * 20 && mouse.x <= 70 + i * 20) {
				//1
				cube1.enabled = 0;
				cylinder1.enabled = 0;
				pyramid1.enabled = 0;
				sphere1.enabled = 0;
				//2
				cube2_1.enabled = 0;
				cube2_2.enabled = 0;
				//3
				cat3.enabled = 0;
				stage3.enabled = 0;
				//4
				deer4.enabled = 0;
				if (i == 1) {
					cube1.enabled = 1;
					cylinder1.enabled = 1;
					pyramid1.enabled = 1;
					sphere1.enabled = 1;
				}
				else if (i == 2){
					cube2_1.enabled = 1;
					cube2_2.enabled = 1;
				}
				else if (i == 3){
					cat3.enabled = 1;
					stage3.enabled = 1;
				}
				else if (i == 4){
					deer4.enabled = 1;
				}
			}
		}
	}
	else
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
	lerp_position -= wheel.y / Math.abs(wheel.y);
}

function update() {
	cat3.rotation = Vector.lerp(cat3.rotation, lerp_rotation, speed);
	stage3.rotation = Vector.lerp(stage3.rotation, lerp_rotation, speed);
	cube2_1.rotation = Vector.lerp(stage3.rotation, lerp_rotation, speed);
	cube2_2.rotation = Vector.lerp(stage3.rotation, lerp_rotation.copy.multiply(5), speed);
	pyramid1.rotation = Vector.lerp(stage3.rotation, lerp_rotation, speed);
	sphere1.rotation = Vector.lerp(stage3.rotation, lerp_rotation, speed);
	cube1.rotation = Vector.lerp(stage3.rotation, lerp_rotation, speed);
	cylinder1.rotation = Vector.lerp(stage3.rotation, lerp_rotation, speed);
	deer4.rotation = Vector.lerp(stage3.rotation, lerp_rotation, speed);

	camera.look(Vector.substract(new Vector(), camera.position));
	camera.position.z = lerp(camera.position.z, lerp_position, speed);

	render(camera);

	context.fillText("Сцены: ", 10, canvas.height - 10);
	context.fillStyle = "#0000FF";
	for (let i = 1; i <= 4; i++) 
		context.fillText(i, 50 + i * 20, canvas.height - 10);
}
