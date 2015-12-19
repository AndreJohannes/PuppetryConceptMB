/// <reference path="jquery.d.ts" />
/// <reference path="three.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="solver.ts" />
/// <reference path="objects.ts" />

class Render {

    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private controls: THREE.TrackballControls;

    private solver = { "solve": function() { } };
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
        scene.add(this.volante);
        var that = this;
        (new THREE.ObjectLoader).load('json/scene.json', function(obj) {
            (<THREE.SpotLight>obj.getObjectByName("SpotLight1")).shadowDarkness = .6;
            (<THREE.SpotLight>obj.getObjectByName("SpotLight2")).shadowDarkness = .3;
            scene.add(obj);
            (new THREE.ObjectLoader).load('json/volante.json', function(obj) {
                that.volante = obj;
                that.scene.add(obj);
                obj.rotation.order = "YZX";
                that.solver = new Solver.Solver(scene);
            });
        });

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
        this.renderer.setClearColor(0x101010);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    
        // Add fps statistics and trackball control
        $('#envelope').append(this.renderer.domElement);
        this.stats = this.addStats($('#envelope'));
        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

    }


    private addStats(dom: JQuery): Stats {
        var stats: Stats = new Stats();
        dom.append(stats.domElement);
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
        this.renderer.render(this.scene, this.camera);
    }

}

window.onload = function() {
    this.render = new Render();
    this.render.animate();
    var render = this.render;
    var connection = new WebSocket('ws://' + window.location.hostname + ':9090', [
        'soap', 'xmpp']);
    connection.onmessage = function(e) {
        var data = JSON.parse(e.data);
        render.solver.setVolante(data);
        render.volante.rotation.y = -data[0];
        render.volante.rotation.z = -data[2];
        //       mesh.rotation.y = -data[0];
        //  mesh.rotation.x = -data[1];
        //  mesh.rotation.z = -data[2];
    };
};