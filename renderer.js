let render_time = (new Date).getTime();
function render(camera) {
	screenSize = (new Vector(canvas.width, canvas.height)).length;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#000000";
	context.fillText(Math.floor(1000 / ((new Date).getTime() - render_time)) + " FPS", 1, 10);
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

	let canvasData = context.getImageData(0, 0, canvas.width, canvas.height);
	let depth = new Array(canvas.width * canvas.height);

	function triangle(vertex1, vertex2, vertex3, v1_3, v2_3, v3_3, r, g, b) {
		let v1 = new Vector(Math.floor(vertex1.x), Math.floor(vertex1.y));
		let v2 = new Vector(Math.floor(vertex2.x), Math.floor(vertex2.y));
		let v3 = new Vector(Math.floor(vertex3.x), Math.floor(vertex3.y));

		let min = new Vector(Math.min(Math.min(v1.x, v2.x), v3.x), Math.min(Math.min(v1.y, v2.y), v3.y));
		let max = new Vector(Math.max(Math.max(v1.x, v2.x), v3.x), Math.max(Math.max(v1.y, v2.y), v3.y));
		
		function point(x, y) {
			function point_3() {
				function _point_3(_v1, _v2, _v3, _v1_3, _v2_3, _v3_3, i) {
					let midpoint = Vector.add(_v1, _v2).add(_v3).divide(3);
					let midpoint_3 = Vector.add(_v1_3, _v2_3).add(_v3_3).divide(3);
					if (!i) 
						return midpoint_3;
					if (point_in_triangle(new Vector(x, y), _v1, _v2, midpoint))
						return _point_3(_v1, _v2, midpoint, _v1_3, _v2_3, midpoint_3, i - 1);
					if (point_in_triangle(new Vector(x, y), _v1, midpoint, _v3))
						return _point_3(_v1, midpoint, _v3, _v1_3, midpoint_3, _v3_3, i - 1);
					if (point_in_triangle(new Vector(x, y), midpoint, _v2, _v3))
						return _point_3(midpoint, _v2, _v3, midpoint_3, _v2_3, _v3_3, i - 1);
					return midpoint_3;
				}
				return _point_3(vertex1, vertex2, vertex3, v1_3, v2_3, v3_3, 50);
			}

			let point_depth = Vector.distance_squared(camera.position, point_3());
			if (!depth[x + y * canvas.width] || point_depth < depth[x + y * canvas.width]) {
				let index = (x + y * canvas.width) * 4;
				canvasData.data[index + 0] = r;
			    canvasData.data[index + 1] = g;
			    canvasData.data[index + 2] = b;
				canvasData.data[index + 3] = 255;
				depth[x + y * canvas.width] = point_depth;
			}
		}
		for (let x = min.x; x < max.x; x++) {
			for (let y = min.y; y < max.y; y++) {
				if (point_in_triangle(new Vector(x, y), v1, v2, v3))
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
			draw_poly: {
				for (let i = 0; i < 3; i++) {
					polygons[poly][i] = Vector.substract(polygons[poly][i], objects[object].center);
					polygons[poly][i] = rotate(polygons[poly][i], x, objects[object].rotation.x);
					polygons[poly][i] = rotate(polygons[poly][i], y, objects[object].rotation.y);
					polygons[poly][i] = rotate(polygons[poly][i], z, objects[object].rotation.z);
					let vertex = new Vector(polygons[poly][i].x * objects[object].scale.x + objects[object].position.x, 
											polygons[poly][i].y * objects[object].scale.y + objects[object].position.y, 
											polygons[poly][i].z * objects[object].scale.z + objects[object].position.z); // vertex pos in space
					vertices.push(vertex);
					if (objects[object].mesh.normals.length > 0) {
						let normal = objects[object].mesh.normals[poly].copy;
						normal = rotate(normal, x, objects[object].rotation.x);
						normal = rotate(normal, y, objects[object].rotation.y);
						normal = rotate(normal, z, objects[object].rotation.z);
						if (Vector.angle(normal, Vector.substract(vertex, camera.position)) < Math.PI / 2)
							break draw_poly;
					}
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
					if (angle <= (camera.viewAngle * Math.PI / 180) / 2) 
						inView = 1;
					x = plane_vector.x * (angle / ((camera.viewAngle * Math.PI / 180) / 2)) * (screenSize / 2);
					y = plane_vector.y * (angle / ((camera.viewAngle * Math.PI / 180) / 2)) * (screenSize / 2);
					points.push(new Vector(x + canvas.width / 2, y + canvas.height / 2));
				}
				if (inView)
					triangle(points[0], points[1], points[2], 
						     vertices[0], vertices[1], vertices[2],
						     object * (256 / objects.length) % 256, poly * (256 / polygons.length) % 256, 255);
			}
		}
	}
	context.putImageData(canvasData, 0, 0);
}
