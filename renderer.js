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

	function triangle(point1, point2, point3, p1_3, p2_3, p3_3, r, g, b) {
		let p1 = new Vector(Math.floor(point1.x), Math.floor(point1.y));
		let p2 = new Vector(Math.floor(point2.x), Math.floor(point2.y));
		let p3 = new Vector(Math.floor(point3.x), Math.floor(point3.y));

		if (p1.x == p2.x && p2.x == p3.x || 
			p1.y == p2.y && p2.y == p3.y ||
			p1.x == p2.x && p1.y == p2.y ||
			p2.x == p3.x && p2.y == p3.y ||
			p3.x == p1.x && p3.y == p1.y)
			return;

		let k1 = (p1.y - p2.y) / (p1.x - p2.x);
		let k2 = (p2.y - p3.y) / (p2.x - p3.x);
		let k3 = (p3.y - p1.y) / (p3.x - p1.x);
		let m1 = p1.y - k1 * p1.x;
		let m2 = p2.y - k2 * p2.x;
		let m3 = p3.y - k3 * p3.x;

		if (k1 == k2 || 
			k2 == k3 ||
			k3 == k1)
			return;

		let min = new Vector(Math.min(Math.min(p1.x, p2.x), p3.x), Math.min(Math.min(p1.y, p2.y), p3.y));
		let max = new Vector(Math.max(Math.max(p1.x, p2.x), p3.x), Math.max(Math.max(p1.y, p2.y), p3.y));
		let midpoint = new Vector((p1.x + p2.x + p3.x) / 3, (p1.y + p2.y + p3.y) / 3);
		
		function point(x, y) {
			// trash line
			let side_lerp = Vector.angle(Vector.substract(new Vector(x, y), point1), Vector.substract(point2, point1)) / Vector.angle(Vector.substract(point3, point1), Vector.substract(point2, point1));
			let side_point = Vector.lerp(point2, point3, side_lerp);
			let side_point_3 = Vector.lerp(p2_3, p3_3, side_lerp);
			let point_lerp = Vector.distance(point1, new Vector(x, y)) / Vector.distance(point1, side_point);
			let point_3 = Vector.lerp(p1_3, side_point_3, point_lerp);
			let point_depth = Vector.distance(camera.position, point_3);

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
				if ((((k1 == Infinity || k1 == -Infinity) && ((midpoint.x < p1.x && x < p1.x) || (midpoint.x >= p1.x && x >= p1.x))) || 
					 (k1 != Infinity && (((midpoint.y < k1 * midpoint.x + m1) && y < k1 * x + m1) || ((midpoint.y >= k1 * midpoint.x + m1)) && y >= k1 * x + m1))) &&
					(((k2 == Infinity || k2 == -Infinity) && ((midpoint.x < p2.x && x < p2.x) || (midpoint.x >= p2.x && x >= p2.x))) || 
					 (k2 != Infinity && (((midpoint.y < k2 * midpoint.x + m2) && y < k2 * x + m2) || ((midpoint.y >= k2 * midpoint.x + m2)) && y >= k2 * x + m2))) &&
					(((k3 == Infinity || k3 == -Infinity) && ((midpoint.x < p3.x && x < p3.x) || (midpoint.x >= p3.x && x >= p3.x))) || 
					 (k3 != Infinity && (((midpoint.y < k3 * midpoint.x + m3) && y < k3 * x + m3) || ((midpoint.y >= k3 * midpoint.x + m3)) && y >= k3 * x + m3))))
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
