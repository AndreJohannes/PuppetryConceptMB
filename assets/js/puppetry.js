var camera, scene, renderer, geometry, material, mesh, connection, start;

window.onload = function() {
	init();
	animate();
	connection = new WebSocket('ws://' + window.location.hostname + ':9090', [
			'soap', 'xmpp' ]);
	connection.onmessage = function(e) {
		var data = JSON.parse(e.data);
		mesh.rotation.y = -data[0];
		mesh.rotation.x = -data[1];
		mesh.rotation.z = -data[2];
	};
}

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, window.innerWidth
			/ window.innerHeight, 1, 10000);
	camera.position.z = 600;
	camera.position.y = 200;

	geometry = new THREE.BoxGeometry(200, 20, 400);
	material = new THREE.MeshBasicMaterial({
		color : 0xff0000,
		wireframe : true
	});
	material = new THREE.MeshPhongMaterial({
		emissive : 0x000000
	});

	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.order = "YXZ";
	scene.add(mesh);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 100, 300);
	scene.add(light);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);

	document.body.appendChild(renderer.domElement);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	// mesh.rotation.x += 0.01;
	// mesh.rotation.y += 0.02;

	renderer.render(scene, camera);
}