if (typeof onMouseDown === "function") 
	canvas.addEventListener("mousedown", onCanvasMouseDown);
function onCanvasMouseDown(e) { 
	if (e.clientX > canvas.width - 250 && e.clientY < 50 && e.clientY > 20) {
		if (e.clientX > canvas.width - 250)
			properties.quality_auto = 1;
		if (e.clientX > canvas.width - 200) {
			properties.quality_auto = 0;
			properties.quality = 1;
		}
		if (e.clientX > canvas.width - 150) {
			properties.quality_auto = 0;
			properties.quality = 2;
		}
		if (e.clientX > canvas.width - 100) {
			properties.quality_auto = 0;
			properties.quality = 3;
		}
		if (e.clientX > canvas.width - 50) {
			properties.quality_auto = 0;
			properties.quality = 4;
		}
	}
	else if (e.clientX > canvas.width - 250 && e.clientX <= canvas.width - 130 && e.clientY > 50 && e.clientY < 70) {
		properties.wireframe = !properties.wireframe;
	}
	else
		onMouseDown(new Vector(e.clientX, e.clientY));
}
if (typeof onMouseMove === "function") 
	canvas.addEventListener("mousemove", _onCanvasMouseMove);
function _onCanvasMouseMove(e) { 
	onMouseMove(new Vector(e.clientX, e.clientY));
}
if (typeof onMouseUp === "function") 
	document.addEventListener("mouseup", onDocumentMouseUp);
function onDocumentMouseUp(e) { 
	onMouseUp(new Vector(e.clientX, e.clientY));
}
if (typeof onMouseWheel === "function") 
	canvas.addEventListener("wheel", onCanvasWheel);
function onCanvasWheel(e) { 
	onMouseWheel(new Vector(e.deltaX, e.deltaY));
}
