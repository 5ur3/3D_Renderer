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
	static distance_squared(pos1, pos2) {
		return Math.pow((pos2.x - pos1.x), 2) + Math.pow((pos2.y - pos1.y), 2) + Math.pow((pos2.z - pos1.z), 2);
	}
	static distance(pos1, pos2) {
		return Math.sqrt(Vector.distance_squared(pos1, pos2));
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

class Mesh {
	constructor(polygons, normals) {
		if (polygons && normals) {
			this.polygons = polygons;
			this.normals = normals;
		}
		else {
			this.polygons = [];
			this.normals = [];
		}
	}

	static loadObject(path) {
		let file = loadFile(path);
		let data = file.split("\n");

		let vertices = [];

		let mesh = [];
		let normals = [];

		let max = new Vector();
		let min = new Vector();

		for (let i = 0; i < data.length; i++) {
			while (/.+\s+$/.test(data[i]))
				data[i] = data[i].slice(0, -1);
			let line = data[i].split(/\s+/);
			if (line[0] == "v") {
				if (line.length != 4) {
					alert("Invalid .obj file: vertices loading failed");
					return undefined;
				}
				vertices.push(new Vector(Number(line[1]), Number(line[2]), Number(line[3])));
			}
			else if (line[0] == "f") {
				if (line.length == 4) {
					mesh.push([vertices[Number(line[1].split('/')[0]) - 1].copy, 
							   vertices[Number(line[2].split('/')[0]) - 1].copy, 
							   vertices[Number(line[3].split('/')[0]) - 1].copy]);
					normals.push(Vector.cross(Vector.substract(vertices[Number(line[1].split('/')[0]) - 1], vertices[Number(line[2].split('/')[0]) - 1]).normalized, 
											  Vector.substract(vertices[Number(line[2].split('/')[0]) - 1], vertices[Number(line[3].split('/')[0]) - 1]).normalized));
					for (let i = 1; i < 4; i++) {
						if (vertices[Number(line[i].split('/')[0]) - 1].x > max.x)
							max.x = vertices[Number(line[i].split('/')[0]) - 1].x;
						if (vertices[Number(line[i].split('/')[0]) - 1].y > max.y)
							max.y = vertices[Number(line[i].split('/')[0]) - 1].y;
						if (vertices[Number(line[i].split('/')[0]) - 1].z > max.z)
							max.z = vertices[Number(line[i].split('/')[0]) - 1].z;

						if (vertices[Number(line[i].split('/')[0]) - 1].x < min.x)
							min.x = vertices[Number(line[i].split('/')[0]) - 1].x;
						if (vertices[Number(line[i].split('/')[0]) - 1].y < min.y)
							min.y = vertices[Number(line[i].split('/')[0]) - 1].y;
						if (vertices[Number(line[i].split('/')[0]) - 1].z < min.z)
							min.z = vertices[Number(line[i].split('/')[0]) - 1].z;
					}

				} else if (line.length == 5) {
					mesh.push([vertices[Number(line[1].split('/')[0]) - 1].copy, 
							   vertices[Number(line[2].split('/')[0]) - 1].copy, 
							   vertices[Number(line[3].split('/')[0]) - 1].copy]);
					mesh.push([vertices[Number(line[3].split('/')[0]) - 1].copy, 
							   vertices[Number(line[4].split('/')[0]) - 1].copy, 
							   vertices[Number(line[1].split('/')[0]) - 1].copy]);
					normals.push(Vector.cross(Vector.substract(vertices[Number(line[1].split('/')[0]) - 1], vertices[Number(line[2].split('/')[0]) - 1]).normalized, 
											  Vector.substract(vertices[Number(line[2].split('/')[0]) - 1], vertices[Number(line[3].split('/')[0]) - 1]).normalized));
					normals.push(Vector.cross(Vector.substract(vertices[Number(line[3].split('/')[0]) - 1], vertices[Number(line[4].split('/')[0]) - 1]).normalized, 
											  Vector.substract(vertices[Number(line[4].split('/')[0]) - 1], vertices[Number(line[1].split('/')[0]) - 1]).normalized));
					for (let i = 1; i < 5; i++) {
						if (vertices[Number(line[i].split('/')[0]) - 1].x > max.x)
							max.x = vertices[Number(line[i].split('/')[0]) - 1].x;
						if (vertices[Number(line[i].split('/')[0]) - 1].y > max.y)
							max.y = vertices[Number(line[i].split('/')[0]) - 1].y;
						if (vertices[Number(line[i].split('/')[0]) - 1].z > max.z)
							max.z = vertices[Number(line[i].split('/')[0]) - 1].z;

						if (vertices[Number(line[i].split('/')[0]) - 1].x < min.x)
							min.x = vertices[Number(line[i].split('/')[0]) - 1].x;
						if (vertices[Number(line[i].split('/')[0]) - 1].y < min.y)
							min.y = vertices[Number(line[i].split('/')[0]) - 1].y;
						if (vertices[Number(line[i].split('/')[0]) - 1].z < min.z)
							min.z = vertices[Number(line[i].split('/')[0]) - 1].z;
					}
				} else {
					alert("Invalid .obj file: vertices loading failed");
					return undefined;
				}
			}
		}

		let move = Vector.substract(new Vector(), new Vector((max.x + min.x) / 2, (max.y + min.y) / 2, (max.z + min.z) / 2));
		let scale = 1 / Math.max(max.x - min.x, Math.max(max.y - min.y, max.z - min.z));
		for (let i = 0; i < mesh.length; i++) {
			for (let j = 0; j < 3; j++) {
				mesh[i][j].add(move);
				mesh[i][j].multiply(scale);
			}
		}
		return new Mesh(mesh, normals);
	}

	static get cube() {
		return Mesh.loadObject("obj/cube.obj");
	}
	static get sphere() {
		return Mesh.loadObject("obj/sphere.obj");
	}
	static get cylinder() {
		return Mesh.loadObject("obj/cylinder.obj");
	}
	static get pyramid() {
		return Mesh.loadObject("obj/pyramid.obj");
	}

	static get cat() {
		return Mesh.loadObject("obj/cat.obj");
	}
	static get cat_lpoly() {
		return Mesh.loadObject("obj/cat_lpoly.obj");
	}
	static get deer() {
		return Mesh.loadObject("obj/deer.obj");
	}
}

class Object3D {
	constructor() {
		this.position = new Vector();
		this.rotation = new Vector();
		this.scale = new Vector(1, 1, 1);
		this.center = new Vector();
		this.mesh = Mesh.cube;	
		objects.push(this);
	}
}

class Camera {
	constructor() {
		this.position = new Vector(0, 0, -10);
		this.rotation = new Vector(0, 0, 0);
		this.viewAngle = 90;
	}

	look(vector) {
		let y = Math.acos(vector.z / (new Vector(vector.x, 0, vector.z)).length);
		if (Math.acos(vector.x / (new Vector(vector.x, 0, vector.z)).length) < Math.PI / 2)
			y += 2 * (Math.PI - y);
		this.rotation = new Vector(vector.y / vector.length / Math.PI * 180, y / Math.PI * 180);
	}
}

class Properties {
	constructor() {
		this.framerate = 60;
	}
}

var properties = new Properties();
