let camera = new Camera();
camera.position.z = -7;

let cube1 = new Object3D();
cube1.mesh = Mesh.cube;
cube1.position.x = -3;
cube1.material.color = new Vector(1, 0, 0);
let pyramid1 = new Object3D();
pyramid1.mesh = Mesh.pyramid;
pyramid1.position.x = -1;
pyramid1.material.color = new Vector(0, 1, 0);
let sphere1 = new Object3D();
sphere1.mesh = Mesh.sphere;
sphere1.position.x = 1;
sphere1.material.color = new Vector(0, 0, 1);
sphere1.scale.y = 0.01;
let cylinder1 = new Object3D();
cylinder1.mesh = Mesh.cylinder;
cylinder1.position.x = 3;
cylinder1.material.color = new Vector(1, 1, 0);
// сцена 2
let cube2_1 = new Object3D();
cube2_1.enabled = 0;
cube2_1.material.color = new Vector(0.3, 0.3, 1);
let cube2_2 = new Object3D();
cube2_2.enabled = 0;
cube2_2.material.color = new Vector(1, 0.3, 0.3);
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
//сцена 5
let balls5 = new Array(20);
let radius5 = 2;
for (let i = 0; i < balls5.length; i++) {
	balls5[i] = new Object3D();
	balls5[i].mesh = Mesh.sphere;
	balls5[i].scale.multiply(0.3);
	balls5[i].enabled = 0;
	balls5[i].center.x = Math.sin(i / balls5.length * Math.PI * 2) * radius5;
	balls5[i].center.z = Math.cos(i / balls5.length * Math.PI * 2) * radius5;
}
let plane5 = new Object3D();
plane5.position.y = -1;
plane5.scale.y = 0.01;
plane5.enabled = 0;
plane5.material.color = new Vector(0.2, 0.2, 0.2);
let ball5 = new Object3D();
ball5.scale.multiply(0.5);
ball5.position.y = 2;
ball5.mesh = Mesh.sphere;
ball5.enabled = 0;
ball5.material.color = new Vector(0.8, 0.8, 0.2);
let ball5_speed = 0;

let speed = 0.1;

let mouse_last = 0;
let mouse_down = 0;
let obj_lerp_rotation = new Vector(0, 180, 0);
let cam_lerp_position = camera.position;
let cam_lerp_rotation = camera.rotation;

function onMouseDown(mouse) {
	if (mouse.y > canvas.height - 30) {
		for (let i = 1; i <= 5; i++) {
			if (mouse.x > 50 + i * 20 && mouse.x <= 70 + i * 20) {
				cam_lerp_position = new Vector(0, 0, -7);
				cam_lerp_rotation = new Vector();
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
				//5
				for (let j = 0; j < balls5.length; j++)
					balls5[j].enabled = 0;
				plane5.enabled = 0;
				ball5.enabled = 0;
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
				else if (i == 5) {
					cam_lerp_position = new Vector(0, 5, -8);
					cam_lerp_rotation = new Vector(-30, 0, 0);
					for (let j = 0; j < balls5.length; j++)
						balls5[j].enabled = 1;
					plane5.enabled = 1;
					ball5.enabled = 1;
				}
			}
		}
	}
	else
		mouse_down = 1;
}
function onMouseMove(mouse) {
	if (mouse_down && mouse_last)
		obj_lerp_rotation.add(new Vector((-(mouse.y - mouse_last.y)) / canvas.height * 360, (mouse.x - mouse_last.x) / canvas.width * 360));
	mouse_last = new Vector(mouse.x, mouse.y);
}
function onMouseUp(mouse) {
	mouse_last = 0;
	mouse_down = 0;
}
function onMouseWheel(wheel) {
	cam_lerp_position.add(camera.position.normalized.multiply(wheel.y / Math.abs(wheel.y)));
}

function update() {
	cat3.rotation = Vector.lerp(cat3.rotation, obj_lerp_rotation, speed);
	stage3.rotation = Vector.lerp(stage3.rotation, obj_lerp_rotation, speed);
	cube2_1.rotation = Vector.lerp(cube2_1.rotation, obj_lerp_rotation, speed);
	cube2_2.rotation = Vector.lerp(cube2_2.rotation, obj_lerp_rotation.copy.multiply(1.7), speed);
	pyramid1.rotation = Vector.lerp(pyramid1.rotation, obj_lerp_rotation, speed);
	sphere1.rotation = Vector.lerp(sphere1.rotation, obj_lerp_rotation, speed);
	cube1.rotation = Vector.lerp(cube1.rotation, obj_lerp_rotation, speed);
	cylinder1.rotation = Vector.lerp(cylinder1.rotation, obj_lerp_rotation, speed);
	deer4.rotation = Vector.lerp(deer4.rotation, obj_lerp_rotation, speed);
	for (let i = 0; i < balls5.length; i++) {
		balls5[i].center.y = Math.sin((new Date).getTime() / 1000 + Math.PI * 6 / balls5.length * i) * 0.15;
		balls5[i].rotation.y = lerp(balls5[i].rotation.y, obj_lerp_rotation.y, speed);
		balls5[i].material.color = new Vector(Math.sin((new Date).getTime() / 1000 + Math.PI * 6 / balls5.length * i),
						 			 Math.cos((new Date).getTime() / 1000 + Math.PI * 6 / balls5.length * i), 
						 			 1);
	}
	ball5_speed -= 0.0098;
	ball5.position.y += ball5_speed;
	if (ball5.position.y < ball5.scale.y + plane5.position.y && ball5_speed < 0) {
		ball5_speed *= -1;
		ball5_speed += 0.0098;
	}
	ball5.rotation.y += 5;

	camera.position = Vector.lerp(camera.position, cam_lerp_position, speed);
	camera.rotation = Vector.lerp(camera.rotation, cam_lerp_rotation, speed);
	render(camera);

	context.fillText("Сцены: ", 10, canvas.height - 10);
	context.fillStyle = "#0000FF";
	for (let i = 1; i <= 5; i++) 
		context.fillText(i, 50 + i * 20, canvas.height - 10);
}
