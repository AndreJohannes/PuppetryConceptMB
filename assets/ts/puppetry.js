/// <reference path="jquery.d.ts" />
/// <reference path="three.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="solver.ts" />
/// <reference path="Objects.ts" />
var Render = (function () {
    function Render() {
        this.solver = new Solver.Solver();
        this.cylinders = new Array();
        this.spheres = new Array();
        this.body = new THREE.Object3D();
        this.volante = new THREE.Object3D();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth
            / window.innerHeight, 1, 10000);
        this.camera.position.z = 220;
        this.camera.position.y = 200;
        var scene = this.scene;
        (new THREE.ObjectLoader).load('json/scene.json', function (obj) {
            obj.getObjectByName("SpotLight1").shadowDarkness = .6;
            obj.getObjectByName("SpotLight2").shadowDarkness = .3;
            scene.add(obj);
        });
        var volante = this.volante;
        volante.position.y = 150;
        volante.rotation.order = "YXZ";
        scene.add(volante);
        (new THREE.ObjectLoader).load('json/volante.json', function (obj) {
            volante.add(obj);
        });
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
        this.renderer.setClearColor(0x101010);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.createObjectsFromJson();
        $('#envelope').append(this.renderer.domElement);
        this.stats = this.addStats($('#envelope'));
        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        var connection = new WebSocket('ws://' + window.location.hostname + ':9090', [
            'soap', 'xmpp']);
        var volante = this.volante;
        var solver = this.solver;
        connection.onmessage = function (e) {
            var data = JSON.parse(e.data);
            solver.setVolante(data);
            volante.rotation.y = -data[0];
            volante.rotation.x = -data[1];
            volante.rotation.z = -data[2];
        };
    }
    Render.prototype.addStats = function (dom) {
        var stats = new Stats();
        dom.append(stats.domElement);
        $(stats.domElement).css('position', 'absolute').css('top', '10px');
        return stats;
    };
    Render.prototype.animate = function () {
        this.stats.begin();
        Render._animate(this)();
    };
    Render._animate = function (render) {
        return function () {
            requestAnimationFrame(Render._animate(render));
            render.controls.update();
            render.stats.update();
            render.render();
        };
    };
    Render.prototype.render = function () {
        this.solver.solve();
        var state = this.solver.getState();
        this.body.rotation.y = state[0];
        // this.cylinders[0].endPoint = new THREE.Vector3(state[0] * 10, state[1] * 10, state[2] * 10);
        // this.spheres[1].centerPoint = new THREE.Vector3(state[0] * 10, state[1] * 10, state[2] * 10);
        // this.cylinders[1].startPoint = new THREE.Vector3(state[0] * 10, state[1] * 10, state[2] * 10);
        // this.cylinders[1].endPoint = new THREE.Vector3(state[6] * 10, state[7] * 10, state[8] * 10);
        // this.spheres[2].centerPoint = new THREE.Vector3(state[6] * 10, state[7] * 10, state[8] * 10);
        // this.spheres[3].centerPoint = new THREE.Vector3(state[12] * 10, state[13] * 10, state[14] * 10);
        this.renderer.render(this.scene, this.camera);
    };
    Render.prototype.createObjectsFromJson = function () {
        var scene = this.scene;
        var cylinders = this.cylinders;
        var spheres = this.spheres;
        var body = this.body;
        scene.add(body);
        $.getJSON("json/data_doll.json", function (data) {
            var pointList = new Array();
            var sphere = new Objects.Sphere(body, 12);
            sphere.centerPoint = new THREE.Vector3(0, 87, 0);
            for (var _i = 0, _a = data.pointList; _i < _a.length; _i++) {
                var point = _a[_i];
                var center = new THREE.Vector3(point[0], point[1], point[2]);
                pointList.push(center);
                var sphere = new Objects.Sphere(body);
                sphere.centerPoint = center;
                spheres.push(sphere);
            }
            ;
            for (var _b = 0, _c = data.linkList; _b < _c.length; _b++) {
                var link = _c[_b];
                var start = pointList[link[0]];
                var end = pointList[link[1]];
                var cylinder = new Objects.Cylinder(body, end.distanceTo(start));
                cylinder.startPoint = start;
                cylinder.endPoint = end;
                cylinders.push(cylinder);
            }
        });
    };
    return Render;
})();
window.onload = function () {
    this.render = new Render();
    this.render.animate();
};
