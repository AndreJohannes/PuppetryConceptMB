/// <reference path="jquery.d.ts" />
/// <reference path="three.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="solver.ts" />
/// <reference path="Objects.ts" />

class Render {

    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private controls: THREE.TrackballControls;

    private solver: Solver.Solver = new Solver.Solver();
    private cylinders: Array<Objects.Cylinder> = new Array();
    private spheres: Array<Objects.Sphere> = new Array();
    private body: THREE.Object3D = new THREE.Object3D();
    private volante: THREE.Object3D = new THREE.Object3D();
    private stats: Stats;

    constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth
            / window.innerHeight, 1, 10000);
        this.camera.position.z = 220;
        this.camera.position.y = 200;

        var scene = this.scene;
        (new THREE.ObjectLoader).load('json/scene.json', function(obj) {
            (<THREE.SpotLight>obj.getObjectByName("SpotLight1")).shadowDarkness = .6;
            (<THREE.SpotLight>obj.getObjectByName("SpotLight2")).shadowDarkness = .3;
            scene.add(obj)
        });

        var volante = this.volante;
        volante.position.y = 150;
        volante.rotation.order = "YXZ";
        scene.add(volante);
        (new THREE.ObjectLoader).load('json/volante.json', function(obj) {
            volante.add(obj);
        });

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
        this.renderer.setClearColor(0x101010);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

        this.createObjectsFromJson();

        $('#envelope').append(<any>this.renderer.domElement);
        this.stats = this.addStats($('#envelope'));
        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);


        var connection = new WebSocket('ws://' + window.location.hostname + ':9090', [
            'soap', 'xmpp']);
        var volante = this.volante;
        var solver = this.solver;
        connection.onmessage = function(e) {
            var data = JSON.parse(e.data);
            solver.setVolante(data);
            volante.rotation.y = -data[0];
            volante.rotation.x = -data[1];
            volante.rotation.z = -data[2];
        };

    }


    private addStats(dom: JQuery): Stats {
        var stats: Stats = new Stats();
        dom.append(<any>stats.domElement);
        $(stats.domElement).css('position', 'absolute').css('top', '10px');
        return stats;
    }

    public animate() {
        this.stats.begin();
        Render._animate(this)();
    }

    private static _animate(render: Render) {
        return function() {
            requestAnimationFrame(Render._animate(render));
            render.controls.update();
            render.stats.update();
            render.render();
        }
    }

    private render() {
        this.solver.solve();
        var state: Array<number> = this.solver.getState();
        this.body.rotation.y = state[0];
        // this.cylinders[0].endPoint = new THREE.Vector3(state[0] * 10, state[1] * 10, state[2] * 10);
        // this.spheres[1].centerPoint = new THREE.Vector3(state[0] * 10, state[1] * 10, state[2] * 10);
        // this.cylinders[1].startPoint = new THREE.Vector3(state[0] * 10, state[1] * 10, state[2] * 10);
        // this.cylinders[1].endPoint = new THREE.Vector3(state[6] * 10, state[7] * 10, state[8] * 10);
        // this.spheres[2].centerPoint = new THREE.Vector3(state[6] * 10, state[7] * 10, state[8] * 10);
        // this.spheres[3].centerPoint = new THREE.Vector3(state[12] * 10, state[13] * 10, state[14] * 10);
        this.renderer.render(this.scene, this.camera);
    }

    private createObjectsFromJson() {
        var scene = this.scene;
        var cylinders = this.cylinders;
        var spheres = this.spheres;
        var body: THREE.Object3D = this.body;
        scene.add(body);
        $.getJSON("json/data_doll.json", function(data) {
            var pointList: Array<THREE.Vector3> = new Array();
            var sphere: Objects.Sphere = new Objects.Sphere(body, 12);
            sphere.centerPoint = new THREE.Vector3(0, 87, 0);
            for (var point of data.pointList) {
                var center: THREE.Vector3 = new THREE.Vector3(point[0], point[1], point[2]);
                pointList.push(center);
                var sphere: Objects.Sphere = new Objects.Sphere(body);
                sphere.centerPoint = center;
                spheres.push(sphere);
            };
            for (var link of data.linkList) {
                var start: THREE.Vector3 = pointList[link[0]];
                var end: THREE.Vector3 = pointList[link[1]];
                var cylinder: Objects.Cylinder = new Objects.Cylinder(body, end.distanceTo(start));
                cylinder.startPoint = start;
                cylinder.endPoint = end;
                cylinders.push(cylinder);
            }
        });
    }

}

window.onload = function() {
    this.render = new Render();
    this.render.animate();

};