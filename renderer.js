let render_time = (new Date).getTime();
function render(camera) {
	screenSize = (new Vector(canvas.width, canvas.height)).length;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#000000";
	context.font = "15px Courier";
	let fps = Math.floor(1000 / ((new Date).getTime() - render_time));
	context.fillText(fps + " КвС", 1, 10);
	if (properties.quality_auto) {
		if (fps < 10 && properties.quality < 4)
			properties.quality++;
		if (fps > 30 && properties.quality > 1)
			properties.quality--;
	}

	context.fillText("Считать", canvas.width - 250, 10);
	context.fillStyle = "#0000FF";
	context.fillText("Авт.", canvas.width - 250, 30);
	context.fillText("100%", canvas.width - 200, 30);
	context.fillText("50%", canvas.width - 150, 30);
	context.fillText("33%", canvas.width - 100, 30);
	context.fillText("25%", canvas.width - 50, 30);
	context.fillStyle = "#000000";
	if (properties.quality_auto) {
		context.fillRect(canvas.width - 250, 35, 40, 1);
		context.fillRect(canvas.width - 50 * (5 - properties.quality) + 5, 35, 20, 1);
	}
	else 
		context.fillRect(canvas.width - 50 * (5 - properties.quality), 35, 40, 1);

	render_time = (new Date).getTime();

	let horizontal = new Vector(1, 0, 0);
	let vertical = new Vector(0, 1, 0);
	let forward = new Vector(0, 0, 1);

	let x = 0; let y = 1; let z = 2;
	function rotate(vector, axis, angle) {
		if (axis == x) {
			let initial_vector = new Vector(0, vector.y, vector.z);
			let initial_length = initial_vector.length;
			let initial_angle = Math.acos(initial_vector.normalized.z);
			if (Math.asin(initial_vector.normalized.y) < 0)
				initial_angle += 2 * (Math.PI - initial_angle)
			return new Vector(vector.x, 
							  Math.sin(initial_angle + (angle * Math.PI / 180)) * initial_length, 
							  Math.cos(initial_angle + (angle * Math.PI / 180)) * initial_length);
		} else if (axis == y) {
			initial_vector = new Vector(vector.x, 0, vector.z);
			initial_length = initial_vector.length;
			initial_angle = Math.acos(initial_vector.normalized.x);
			if (Math.asin(initial_vector.normalized.z) < 0)
				initial_angle += 2 * (Math.PI - initial_angle)
			return new Vector(Math.cos(initial_angle + (angle * Math.PI / 180)) * initial_length, 
							  vector.y,
							  Math.sin(initial_angle + (angle * Math.PI / 180)) * initial_length);
		} else if (axis == z) {
			initial_vector = new Vector(vector.x, vector.y, 0);
			initial_length = initial_vector.length;
			initial_angle = Math.acos(initial_vector.normalized.x);
			if (Math.asin(initial_vector.normalized.y) < 0)
				initial_angle += 2 * (Math.PI - initial_angle)
			return new Vector(Math.cos(initial_angle + (angle * Math.PI / 180)) * initial_length, 
							  Math.sin(initial_angle + (angle * Math.PI / 180)) * initial_length,
							  vector.z);
		}
	}

	let canvas_data = context.getImageData(0, 0, canvas.width, canvas.height);
	let depth = new Array(canvas.width * canvas.height);

	function triangle(vertex1, vertex2, vertex3, v1_3, v2_3, v3_3, r, g, b) {
		vertex1 = new Vector(Math.floor(vertex1.x), Math.floor(vertex1.y));
		vertex2 = new Vector(Math.floor(vertex2.x), Math.floor(vertex2.y));
		vertex3 = new Vector(Math.floor(vertex3.x), Math.floor(vertex3.y));
		let min = new Vector(Math.min(Math.min(vertex1.x, vertex2.x), vertex3.x), 
							 Math.min(Math.min(vertex1.y, vertex2.y), vertex3.y));
		let max = new Vector(Math.max(Math.max(vertex1.x, vertex2.x), vertex3.x), 
							 Math.max(Math.max(vertex1.y, vertex2.y), vertex3.y));

		let v1 = Vector.substract(vertex2, vertex1);
		let v2 = Vector.substract(vertex3, vertex1);

		let dot11 = v1.dot(v1);
		let dot12 = v1.dot(v2);
		let dot22 = v2.dot(v2);
		let dot11_22_m_dot12_12 = dot22 * dot11 - dot12 * dot12;
		if (!dot11_22_m_dot12_12) 
			return;

		function point(x, y) {
			let v = Vector.substract(new Vector(x, y), vertex1);
			let dot01 = v.dot(v1);
			let dot02 = v.dot(v2);
			let U = (dot11 * dot02 - dot12 * dot01) / dot11_22_m_dot12_12;
			let V = (dot22 * dot01 - dot12 * dot02) / dot11_22_m_dot12_12;
			if (U < 0 || V < 0 || U + V > 1)
				return;

			let point_depth = Vector.distance_squared(camera.position, Vector.add(Vector.substract(v2_3, v1_3).multiply(V), Vector.substract(v3_3, v1_3).multiply(U)).add(v1_3));
			if (!depth[x + y * canvas.width] || point_depth < depth[x + y * canvas.width]) {
				for (let X = 0; X < properties.quality; X++) {
					for (let Y = 0; Y < properties.quality; Y++) {
						let index = (x + X + (y + Y) * canvas.width) * 4;
						canvas_data.data[index + 0] = r;
					    canvas_data.data[index + 1] = g;
					    canvas_data.data[index + 2] = b;
						canvas_data.data[index + 3] = 255;
					}
				}
				depth[x + y * canvas.width] = point_depth;
			}
		}
		for (let x = min.x - min.x % properties.quality; x < max.x; x += properties.quality) {
			for (let y = min.y - min.y % properties.quality; y < max.y; y += properties.quality) {
				point(x, y);
			}
		}
	}

	vertical = rotate(vertical, x, camera.rotation.x);
	vertical = rotate(vertical, y, camera.rotation.y);
	vertical = rotate(vertical, z, camera.rotation.z);
	horizontal = rotate(horizontal, x, camera.rotation.x);
	horizontal = rotate(horizontal, y, camera.rotation.y);
	horizontal = rotate(horizontal, z, camera.rotation.z);
	forward = rotate(forward, x, camera.rotation.x);
	forward = rotate(forward, y, camera.rotation.y);
	forward = rotate(forward, z, camera.rotation.z);

	for (let object = 0; object < objects.length; object++) {
		let polygons = [];
		for (let poly = 0; poly < objects[object].mesh.polygons.length; poly++) {
			polygons.push([]);
			for (let i = 0; i < 3; i++)
				polygons[poly].push(Object.assign({}, objects[object].mesh.polygons[poly][i]));
		}
		for (let poly = 0; poly < polygons.length; poly++) {
			let points = [];
			let inView = 0;
			let vertices = [];
			let normal = objects[object].mesh.normals[poly].copy;
			normal = rotate(normal, x, objects[object].rotation.x);
			normal = rotate(normal, y, objects[object].rotation.y);
			normal = rotate(normal, z, objects[object].rotation.z);
			
			draw_poly: {
				for (let i = 0; i < 3; i++) {
					polygons[poly][i] = new Vector(polygons[poly][i].x * objects[object].scale.x, 
												   polygons[poly][i].y * objects[object].scale.y, 
												   polygons[poly][i].z * objects[object].scale.z);
					polygons[poly][i] = Vector.substract(polygons[poly][i], objects[object].center);
					polygons[poly][i] = rotate(polygons[poly][i], x, objects[object].rotation.x);
					polygons[poly][i] = rotate(polygons[poly][i], y, objects[object].rotation.y);
					polygons[poly][i] = rotate(polygons[poly][i], z, objects[object].rotation.z);
					let vertex = new Vector(polygons[poly][i].x + objects[object].position.x, 
											polygons[poly][i].y + objects[object].position.y, 
											polygons[poly][i].z + objects[object].position.z); // vertex pos in space
					vertices.push(vertex);
					if (Vector.angle(normal, Vector.substract(vertex, camera.position)) < Math.PI / 2)
						break draw_poly;
					let vertex2cam = new Vector(vertex.x - camera.position.x, vertex.y - camera.position.y, vertex.z - camera.position.z); // vertex pos in camera space
					let angle = Vector.angle(vertex2cam, forward); // angle btw camera's view vector and vector from camera to vertex pos
					let cam2plane = new Vector(forward.x * Math.cos(angle) * vertex2cam.length, 
											   forward.y * Math.cos(angle) * vertex2cam.length, 
											   forward.z * Math.cos(angle) * vertex2cam.length); // vector from camera to plane's origin
					let vertex2plane = new Vector(vertex2cam.x - cam2plane.x, 
												  vertex2cam.y - cam2plane.y, 	
												  vertex2cam.z - cam2plane.z); // vector from plane's origin to vertex
					let horizontal_angle = Vector.angle(horizontal, vertex2plane);
					let vertical_angle = Vector.angle(vertical, vertex2plane);
					let plane_angle = horizontal_angle;
					if (vertical_angle > Math.PI / 2)
						plane_angle += 2 * (Math.PI - plane_angle);
					let plane_vector = (new Vector(Math.cos(plane_angle), -Math.sin(plane_angle))).normalized;
					if (angle <= (camera.field_of_view * Math.PI / 180) / 2) 
						inView = 1;
					x = plane_vector.x * (angle / ((camera.field_of_view * Math.PI / 180) / 2)) * (screenSize / 2);
					y = plane_vector.y * (angle / ((camera.field_of_view * Math.PI / 180) / 2)) * (screenSize / 2);
					points.push(new Vector(x + canvas.width / 2, y + canvas.height / 2));
				}
				if (inView) {
					let color = Math.floor(lerp(205, 50, Vector.angle(Vector.substract(new Vector(), forward), normal) / (Math.PI / 2))); 
					triangle(points[0], points[1], points[2], vertices[0], vertices[1], vertices[2], color, color, color);
				}
			}
		}
	}
	context.putImageData(canvas_data, 0, 0);
}
