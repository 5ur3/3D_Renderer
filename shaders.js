class Color {
	constructor() { 
		this.color = new Vector(1, 1, 1);
	}
	draw(vertex1, vertex2, vertex3, v1_3, v2_3, v3_3, depth_buffer, screen_buffer) {
		let r = 0; let g = 0; let b = 0;
		let normal = Vector.cross(Vector.substract(v1_3, v2_3).normalized, 
								  Vector.substract(v2_3, v3_3).normalized);
		for (let i = 0; i < directional_lights.length; i++) {
			let illumination = Math.floor(lerp(255, 0, Vector.angle(Vector.substract(new Vector(), Vector.multiply(directional_lights[i].direction, Math.PI / 180)), normal) / (Math.PI / 2)) * directional_lights[i].intensity); 
			r += Math.floor(illumination * this.color.x);
			g += Math.floor(illumination * this.color.y);
			b += Math.floor(illumination * this.color.z);
		}
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
		let v12_3 = Vector.substract(v2_3, v1_3);
		let v13_3 = Vector.substract(v3_3, v1_3);
		function point(x, y) {
			let v = Vector.substract(new Vector(x, y), vertex1);
			let dot01 = v.dot(v1);
			let dot02 = v.dot(v2);
			let U = (dot22 * dot01 - dot12 * dot02) / dot11_22_m_dot12_12;
			let V = (dot11 * dot02 - dot12 * dot01) / dot11_22_m_dot12_12;
			if (U < 0 || V < 0 || U + V > 1)
				return;

			let point_depth = Vector.distance_squared(camera.position, Vector.add(v12_3.copy.multiply(U), v13_3.copy.multiply(V)).add(v1_3));
			// закрашивать пиксель только если он первый или выше предыдущего
			if (!depth_buffer[x + y * canvas.width] || point_depth < depth_buffer[x + y * canvas.width]) {
				for (let X = 0; X < properties.quality; X++) {
					for (let Y = 0; Y < properties.quality; Y++) {
						if (x + X < 0 || x + X >= canvas.width || y + Y < 0 || y + Y >= canvas.height)
							continue;
						let index = (x + X + (y + Y) * canvas.width) * 4;
						screen_buffer[index + 0] = r;
					    screen_buffer[index + 1] = g;
					    screen_buffer[index + 2] = b;
						screen_buffer[index + 3] = 255;
					}
				}
				depth_buffer[x + y * canvas.width] = point_depth;
			}
		}
		for (let x = Math.max(min.x - min.x % properties.quality, 0); x < Math.min(max.x, canvas.width); x += properties.quality) {
			for (let y = Math.max(min.y - min.y % properties.quality, 0); y < Math.min(max.y, canvas.height); y += properties.quality) {
				point(x, y);
			}
		}
	}
}
