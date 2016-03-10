/// <reference path="jquery.d.ts" />
/// <reference path="three.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="solver.ts" />
/// <reference path="objects.ts" />
var Render = (function () {
    function Render() {
        this.solver = { "solve": function () { } };
        this.cylinders = new Array();
        this.spheres = new Array();
        this.body = new THREE.Object3D();
        this.stage = new THREE.Object3D();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth
            / window.innerHeight, 1, 10000);
        this.camera.position.z = 220;
        this.camera.position.y = 200;
        var scene = this.scene;
        //sscene.add(this.volante);
        scene.add(this.stage);
        scene.add(this.body);
        var that = this;
        (new THREE.ObjectLoader).load('json/scene.json', function (obj) {
            obj.getObjectByName("SpotLight1").shadowDarkness = .6;
            obj.getObjectByName("SpotLight2").shadowDarkness = .3;
            var stage = (obj.getObjectByName("stage"));
            var texture = THREE.ImageUtils.loadTexture("textures/floorboards.jpg");
            stage.material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
            that.stage.add(obj);
            that.lighting = new Lighting.Lighting(that.scene);
            (new THREE.JSONLoader).load('json/micro.json', function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xaaaaaa }));
                mesh.scale.x = 120;
                mesh.scale.y = 120;
                mesh.scale.z = 120;
                mesh.rotateY(Math.PI / 2);
                mesh.translateY(140);
                mesh.translateX(-60);
                that.stage.add(mesh);
                //that.scene.add(obj);
                //obj.rotation.order = "YZX";
                that.solver = new Solver.Solver(that.body);
            });
        });
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
        this.renderer.setClearColor(0x101010);
        //this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        // Add fps statistics and trackball control
        $('#envelope').append(this.renderer.domElement);
        this.stats = this.addStats($('#envelope'));
        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        this.controls.target0.y = 100;
        this.controls.reset();
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
        this.renderer.render(this.scene, this.camera);
    };
    return Render;
})();
window.onload = function () {
    this.render = new Render();
    this.render.animate();
    var render = this.render;
    var audio = new Audio("music/twist.mp3");
    //var connection = new WebSocket('ws://' + window.location.hostname + ':9090', [
    var connection = new WebSocket('ws://192.168.1.6:9090', [
        'soap', 'xmpp']);
    connection.onmessage = function (e) {
        var data = JSON.parse(e.data);
        //render.solver.setVolante(data.ort);
        var solver = (render.solver);
        var twist = false;
        var leftArm = false;
        var rightArm = false;
        for (var _i = 0, _a = data.cmds; _i < _a.length; _i++) {
            var command = _a[_i];
            switch (command) {
                case Solver.Commands.JawOpen:
                    solver.openJaw();
                    break;
                case Solver.Commands.JawClose:
                    solver.closeJaw();
                    break;
                case Solver.Commands.LeftLegTwist:
                    twist = true;
                    break;
                case Solver.Commands.PlayAudio:
                    audio.src = "music/twist.mp3";
                    audio.play();
                    render.lighting.start();
                    break;
                case Solver.Commands.StopAudio:
                    audio.src = "music/twist.mp3";
                    break;
                case Solver.Commands.MoveLeftArm:
                    leftArm = true;
                    break;
                case Solver.Commands.MoveRightArm:
                    rightArm = true;
                    break;
            }
        }
        solver.setVolante(data.ort, data.acc, twist, leftArm, rightArm);
    };
};
