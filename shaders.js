class Color {
	constructor() { 
		this.color = new Vector(1, 1, 1);
	}
	draw(data) {
		let r = 0; let g = 0; let b = 0;
		for (let i = 0; i < directional_lights.length; i++) {
			let illumination = Math.floor(lerp(255, 0, Vector.angle(Vector.substract(new Vector(), Vector.multiply(directional_lights[i].direction, Math.PI / 180)), data.normal) / (Math.PI / 2)) * directional_lights[i].intensity); 
			r += Math.floor(illumination * this.color.x);
			g += Math.floor(illumination * this.color.y);
			b += Math.floor(illumination * this.color.z);
		}

		return new Vector(r, g, b);
	}
}
