let render_time = (new Date).getTime();
function render(camera) {
	screenSize = (new Vector(canvas.width, canvas.height)).length;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#EEEEEE";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// инициализация векторов камеры
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

	// инициализация буффера цвета и глубины пикселей
	let canvas_data = context.getImageData(0, 0, canvas.width, canvas.height);
	let depth = new Array(canvas.width * canvas.height);

	// вращение всех векторов камеры
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
		if (!objects[object].enabled) 
			continue;
		// создание копии массива полигонов для дальнейшей модификации (вращения и т.п.)
		let polygons = [];
		for (let poly = 0; poly < objects[object].mesh.polygons.length; poly++) {
			polygons.push([]);
			for (let i = 0; i < 3; i++)
				polygons[poly].push(Object.assign({}, objects[object].mesh.polygons[poly][i]));
		}
		for (let poly = 0; poly < polygons.length; poly++) {
			let points = [];
			// инициализация переменной, отвечающей за то, должен ли полигон рисоваться на экране
			let vertices = [];
			draw_poly: {
				for (let i = 0; i < 3; i++) {
					// скалирование, вращение и трансляция позиций вершин в глобальные координаты
					polygons[poly][i] = new Vector(polygons[poly][i].x * objects[object].scale.x, 
												   polygons[poly][i].y * objects[object].scale.y, 
												   polygons[poly][i].z * objects[object].scale.z);
					polygons[poly][i] = Vector.substract(polygons[poly][i], objects[object].center);
					polygons[poly][i] = rotate(polygons[poly][i], x, objects[object].rotation.x);
					polygons[poly][i] = rotate(polygons[poly][i], y, objects[object].rotation.y);
					polygons[poly][i] = rotate(polygons[poly][i], z, objects[object].rotation.z);
					let vertex = new Vector(polygons[poly][i].x + objects[object].position.x, 
											polygons[poly][i].y + objects[object].position.y, 
											polygons[poly][i].z + objects[object].position.z); // позиция вершины в пространстве
					vertices.push(vertex);
					
					let vertex2cam = new Vector(vertex.x - camera.position.x, vertex.y - camera.position.y, vertex.z - camera.position.z); // позиция вершины в пространстве камеры
					let angle = Vector.angle(vertex2cam, forward); // угол между нормалью камеры и вектором от камеры до позициии вершины
					let cam2plane = new Vector(forward.x * Math.cos(angle) * vertex2cam.length, 
											   forward.y * Math.cos(angle) * vertex2cam.length, 
											   forward.z * Math.cos(angle) * vertex2cam.length); // точка, от которой будет проводится перпендикуляр в позицию вершины. Находится на нормали. 
					let vertex2plane = new Vector(vertex2cam.x - cam2plane.x, 
												  vertex2cam.y - cam2plane.y, 	
												  vertex2cam.z - cam2plane.z); // вектор перпендикулярный нормали и идущий до позиции вершины В описании алгоритма называется вектор b
					let horizontal_angle = Vector.angle(horizontal, vertex2plane);
					let vertical_angle = Vector.angle(vertical, vertex2plane);
					let plane_angle = horizontal_angle;
					if (vertical_angle > Math.PI / 2)
						plane_angle += 2 * (Math.PI - plane_angle);
					let plane_vector = (new Vector(Math.cos(plane_angle), -Math.sin(plane_angle))).normalized;
					x = plane_vector.x * (angle / ((camera.field_of_view * Math.PI / 180) / 2)) * (screenSize / 2);
					y = plane_vector.y * (angle / ((camera.field_of_view * Math.PI / 180) / 2)) * (screenSize / 2);
					points.push(new Vector(x + canvas.width / 2, y + canvas.height / 2));
				} 
				let normal = Vector.cross(Vector.substract(vertices[0], vertices[1]).normalized, 
								  		  Vector.substract(vertices[1], vertices[2]).normalized);
				for (let i = 0; i < 3; i++) 
					if (Vector.angle(normal, Vector.substract(vertices[i], camera.position)) < Math.PI / 2)
							break draw_poly;

				if (!properties.wireframe) {
					objects[object].shader.draw(points[0], points[1], points[2], 
							 vertices[0], vertices[1], vertices[2], 
							 depth, canvas_data.data);
				}
				else {
					// соединение точек полигона линиями при wireframe рендере
					context.strokeStyle = "#000000";
					context.beginPath();
					context.moveTo(points[0].x, points[0].y);
					context.lineTo(points[1].x, points[1].y);
					context.lineTo(points[2].x, points[2].y);
					context.lineTo(points[0].x, points[0].y);
					context.stroke(); 
					context.closePath();
				}
			}
		}
	}
	// Нанесение буффера цвета пикселей на холст
	if (!properties.wireframe)
		context.putImageData(canvas_data, 0, 0);

	// Отрисовка меню и счетчика количества кадров в секунду
	context.fillStyle = "#000000";
	context.font = "15px Courier";
	let fps = Math.floor(1000 / ((new Date).getTime() - render_time));
	context.fillText(fps + " Кадр/с", 1, 10);
	if (properties.quality_auto) {
		if (fps < 10 && properties.quality < 4)
			properties.quality++;
		if (fps > 24 && properties.quality > 1)
			properties.quality--;
	}

	context.fillText("Считать", canvas.width - 250, 10);
	context.fillStyle = "#0000FF";
	context.fillText("Авт.", canvas.width - 250, 30);
	context.fillText("100%", canvas.width - 200, 30);
	context.fillText("50%", canvas.width - 150, 30);
	context.fillText("33%", canvas.width - 100, 30);
	context.fillText("25%", canvas.width - 50, 30);
	if (properties.quality_auto) {
		context.fillRect(canvas.width - 250, 35, 40, 1);
		context.fillRect(canvas.width - 50 * (5 - properties.quality) + 5, 35, 20, 1);
	}
	else 
		context.fillRect(canvas.width - 50 * (5 - properties.quality), 35, 40, 1);

	context.fillText("Закрашивать", canvas.width - 250, 55)
	if (!properties.wireframe)
		context.fillRect(canvas.width - 250, 60, 100, 1)
	context.fillStyle = "#000000";

	render_time = (new Date).getTime();
}
