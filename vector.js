class Vector {
	constructor(x, y, z) {
		if (x)
			this.x = x;
		else
			this.x = 0;
		if (y)
			this.y = y;
		else
			this.y = 0;
		if (z)
			this.z = z;
		else
			this.z = 0;
	}
	// Квадрат расстояния используется в тех случаях, когда нужно сравнить 2 расстояния.
	static distance_squared(pos1, pos2) {
		return Math.pow((pos2.x - pos1.x), 2) + Math.pow((pos2.y - pos1.y), 2) + Math.pow((pos2.z - pos1.z), 2);
	}
	static distance(pos1, pos2) {
		return Math.sqrt(Math.pow((pos2.x - pos1.x), 2) + Math.pow((pos2.y - pos1.y), 2) + Math.pow((pos2.z - pos1.z), 2));
	}
	static length(vector) {
		return Vector.distance(new Vector(), vector);
	}
	static angle(vector1, vector2) {
		return Math.acos(Math.min(Math.max((vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z) / (Vector.length(vector1) * Vector.length(vector2)), -1), 1));
	}
	static normalize(vector) { 
		let scale = 1 / vector.length;
		return Vector.multiply(vector, scale);
	}
	static add(vector1, vector2) {
		return new Vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
	}
	static substract(vector1, vector2) {
		return new Vector(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
	}
	static multiply(vector, factor) {
		return new Vector(vector.x * factor, vector.y * factor, vector.z * factor);
	}
	static divide(vector, factor) {
		return new Vector(vector.x / factor, vector.y / factor, vector.z / factor);
	}
	static cross(vector1, vector2) {
		return new Vector(vector1.y * vector2.z - vector1.z * vector2.y, vector1.z * vector2.x - vector1.x * vector2.z, vector1.x * vector2.y - vector1.y * vector2.x);
	}
	static lerp(vector1, vector2, value) {
		return new Vector(lerp(vector1.x, vector2.x, value), lerp(vector1.y, vector2.y, value), lerp(vector1.z, vector2.z, value));
	}
	static dot(vector1, vector2) {
		return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
	}
	static equal(vector1, vector2) {
		return(vector1.x == vector2.x && vector1.y == vector2.y && vector1.z == vector2.z);
	}

	distance(pos2) {
		return Vector.distance(this, pos2);
	}
	angle(vector2) {
		return Vector.angle(this, vector2);
	}
	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
		return this;
	}
	substract(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		this.z -= vector.z;
		return this;
	}
	multiply(factor) {
		this.x *= factor;
		this.y *= factor;
		this.z *= factor;
		return this;
	}
	divide(factor) {
		this.x /= factor;
		this.y /= factor;
		this.z /= factor;
		return this;
	}
	dot(vector) {
		return Vector.dot(this, vector);
	}
	equal(vector) {
		return Vector.equal(this, vector);
	}
	

	get length() {
		return Vector.length(this);
	}
	get normalized() {
		return Vector.normalize(this);
	}
	get copy() {
		return new Vector(this.x, this.y, this.z);
	}
}
