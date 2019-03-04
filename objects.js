class Mesh {
	constructor(polygons) {
		if (polygons)
			this.polygons = polygons;
		else 
			this.polygons = [];
	}

	static load_object(path) {
		if (typeof Mesh.load_object.cached == 'undefined') 
			Mesh.load_object.cached = {}; 
		if (Mesh.load_object.cached.hasOwnProperty(path)) 
			return {mesh: Mesh.load_object.cached[path], name: path}; 

		let file = load_file(path);
		let data = file.split("\n");

		let vertices = [];
		let mesh = [];

		let max = new Vector();
		let min = new Vector();

		for (let i = 0; i < data.length; i++) {
			while (/.+\s+$/.test(data[i]))
				data[i] = data[i].slice(0, -1);
			let line = data[i].split(/\s+/);
			if (line[0] == "v") {
				if (line.length != 4) {
					alert("Ошибка загрузки вершин. Пожалуйста, сообщите автору об ошибке: https://github.com/5ur3/3D_Renderer/issues");
					return undefined;
				}
				vertices.push(new Vector(Number(line[1]), Number(line[2]), Number(line[3])));
			}
			else if (line[0] == "f") {
				if (line.length == 4) {
					mesh.push([vertices[Number(line[1].split('/')[0]) - 1].copy, 
							   vertices[Number(line[2].split('/')[0]) - 1].copy, 
							   vertices[Number(line[3].split('/')[0]) - 1].copy]);
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
					alert("Ошибка загрузки плоскостей. Пожалуйста, сообщите автору об ошибке: https://github.com/5ur3/3D_Renderer/issues");
					return undefined;
				}
			}
		}

		//Объект загружается таким образом, чтобы его центр был в точке (0, 0, 0), а максимальный размер в одной из осей был равен одному. Т.Е. чтобы ни одна точка не выходила за пределы куба (-0.5, -0.5, -0.5)-(0.5, 0.5, 0.5)
		let move = Vector.substract(new Vector(), new Vector((max.x + min.x) / 2, (max.y + min.y) / 2, (max.z + min.z) / 2));
		let scale = 1 / Math.max(max.x - min.x, Math.max(max.y - min.y, max.z - min.z));
		for (let i = 0; i < mesh.length; i++) {
			for (let j = 0; j < 3; j++) {
				mesh[i][j].add(move);
				mesh[i][j].multiply(scale);
			}
		}
		Mesh.load_object.cached[path] = new Mesh(mesh);
		return {mesh: new Mesh(mesh), name: path};
	}

	static get empty() {
		return {mesh: new Mesh(), name: "empty"};
	}
	static get cube() {
		return Mesh.load_object("obj/cube.obj");
	}
	static get sphere() {
		return Mesh.load_object("obj/sphere.obj");
	}
	static get cylinder() {
		return Mesh.load_object("obj/cylinder.obj");
	}
	static get pyramid() {
		return Mesh.load_object("obj/pyramid.obj");
	}

	static get cat() {
		return Mesh.load_object("obj/cat.obj");
	}
	static get cat_lpoly() {
		return Mesh.load_object("obj/cat_lpoly.obj");
	}
	static get deer() {
		return Mesh.load_object("obj/deer.obj");
	}
}

class Object3D {
	constructor() {
		this.position = new Vector();
		this.rotation = new Vector();
		this.scale = new Vector(1, 1, 1);
		this.center = new Vector();
		this.shader = new Color();
		this._mesh = Mesh.cube.mesh;
		this.mesh_name = "obj/cube.obj";
		this.enabled = 1;
		objects.push(this);
	}
	set mesh(mesh) {
		this._mesh = mesh.mesh;
		this.mesh_name = mesh.name;
	}
	get mesh() {
		return this._mesh;
	}
}

class Camera {
	constructor() {
		this.position = new Vector(0, 0, -10);
		this.rotation = new Vector(0, 0, 0);
		this.field_of_view = 90;
	}

	look(vector) {
		let y = Math.acos(vector.z / (new Vector(vector.x, 0, vector.z)).length);
		if (Math.acos(vector.x / (new Vector(vector.x, 0, vector.z)).length) < Math.PI / 2)
			y += 2 * (Math.PI - y);
		this.rotation = new Vector(vector.y / vector.length / Math.PI * 180, y / Math.PI * 180);
	}
}

class Directional_Light {
	constructor() {
		this.direction = new Vector(1, -1, 1);
		this.intensity = 1;
		directional_lights.push(this);
	}
}

class Properties {
	constructor() {
		this.framerate = 60;
		this.quality_auto = 1;
		this.quality = 1;
		this.wireframe = 0;
	}
}

var properties = new Properties();
