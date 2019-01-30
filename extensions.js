var objects = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

Array.prototype.clone = function() {
	return this.slice(0);
};

function load_file(filePath) {
	let result = null;
	let xml_http = new XMLHttpRequest();
	xml_http.open("GET", filePath, false);
	xml_http.send();
	if (xml_http.status==200)
		result = xml_http.responseText;
	return result;
}

function lerp(val1, val2, val) {
	return val1 + (val2 - val1) * val;
}

function point_in_triangle(point, vertex1, vertex2, vertex3) {
	// проверка на площадь треугольника (на то, что она есть)
	if (vertex1.x == vertex2.x && vertex2.x == vertex3.x || 
		vertex1.y == vertex2.y && vertex2.y == vertex3.y ||
		vertex1.x == vertex2.x && vertex1.y == vertex2.y ||
		vertex2.x == vertex3.x && vertex2.y == vertex3.y ||
		vertex3.x == vertex1.x && vertex3.y == vertex1.y)
		return false;

	let k1 = (vertex1.y - vertex2.y) / (vertex1.x - vertex2.x);
	let k2 = (vertex2.y - vertex3.y) / (vertex2.x - vertex3.x);
	let k3 = (vertex3.y - vertex1.y) / (vertex3.x - vertex1.x);
	let m1 = vertex1.y - k1 * vertex1.x;
	let m2 = vertex2.y - k2 * vertex2.x;
	let m3 = vertex3.y - k3 * vertex3.x;

	// проверка на площадь треугольника
	if (k1 == k2 || 
		k2 == k3 ||
		k3 == k1)
		return false;

	let midpoint = new Vector((vertex1.x + vertex2.x + vertex3.x) / 3, (vertex1.y + vertex2.y + vertex3.y) / 3);

	// проверяет, заключена ли точка point внутри трех линейных функций, образующих треугольник
	if ((((k1 == Infinity || k1 == -Infinity) && ((midpoint.x < vertex1.x && point.x < vertex1.x) || (midpoint.x >= vertex1.x && point.x >= vertex1.x))) || 
		  (k1 != Infinity && (((midpoint.y < k1 * midpoint.x + m1) && point.y < k1 * point.x + m1) || ((midpoint.y >= k1 * midpoint.x + m1)) && point.y >= k1 * point.x + m1))) &&
		(((k2 == Infinity || k2 == -Infinity) && ((midpoint.x < vertex2.x && point.x < vertex2.x) || (midpoint.x >= vertex2.x && point.x >= vertex2.x))) || 
		  (k2 != Infinity && (((midpoint.y < k2 * midpoint.x + m2) && point.y < k2 * point.x + m2) || ((midpoint.y >= k2 * midpoint.x + m2)) && point.y >= k2 * point.x + m2))) &&
		(((k3 == Infinity || k3 == -Infinity) && ((midpoint.x < vertex3.x && point.x < vertex3.x) || (midpoint.x >= vertex3.x && point.x >= vertex3.x))) || 
		  (k3 != Infinity && (((midpoint.y < k3 * midpoint.x + m3) && point.y < k3 * point.x + m3) || ((midpoint.y >= k3 * midpoint.x + m3)) && point.y >= k3 * point.x + m3))))
		return true;
	return false;	
}
