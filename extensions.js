// Данный скрипт содержит список функций, которые я не смог включить в какой-либо из объектов

var objects = [];
var directional_lights = [];

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
