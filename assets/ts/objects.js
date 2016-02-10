/// <reference path="three.d.ts" />
var Objects;
(function (Objects) {
    var Sphere = (function () {
        function Sphere(scene, radius) {
            if (radius === void 0) { radius = 3; }
            var sphere = new THREE.SphereGeometry(radius, 15, 10);
            var material = new THREE.MeshPhongMaterial({
                emissive: 0x000000
            });
            this.mesh = new THREE.Mesh(sphere, material);
            this.mesh.castShadow = true;
            if (radius > 0)
                scene.add(this.mesh);
        }
        Object.defineProperty(Sphere.prototype, "centerPoint", {
            get: function () {
                return this._centerPoint;
            },
            set: function (point) {
                this._centerPoint = point;
                this.mesh.position.set(point.x, point.y, point.z);
            },
            enumerable: true,
            configurable: true
        });
        return Sphere;
    })();
    Objects.Sphere = Sphere;
    var Cylinder = (function () {
        function Cylinder(scene, height) {
            this._angle = 0;
            //this.scene = scene;
            var cylinder = new THREE.CylinderGeometry(2.0, 2.0, height, 15, 1);
            var material = new THREE.MeshPhongMaterial({
                emissive: 0x000000,
            });
            this.mesh = new THREE.Mesh(cylinder, material);
            this.mesh.castShadow = true;
            this.body = new THREE.Object3D();
            this.body.add(this.mesh);
            this.pivot = new THREE.Object3D();
            this.pivot.add(this.body);
            scene.add(this.pivot);
        }
        Object.defineProperty(Cylinder.prototype, "startPoint", {
            set: function (point) {
                this._startPoint = point;
                this.updatePositionAndOrientation();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cylinder.prototype, "endPoint", {
            set: function (point) {
                this._endPoint = point;
                this.updatePositionAndOrientation();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cylinder.prototype, "angle", {
            set: function (value) {
                this._angle = value;
                this.updatePositionAndOrientation();
            },
            enumerable: true,
            configurable: true
        });
        Cylinder.prototype.addObject = function (object) {
            this.body.add(object);
        };
        Cylinder.prototype.updatePositionAndOrientation = function () {
            if (this._startPoint == null || this._endPoint == null)
                return;
            var midPoint = this._endPoint.clone().add(this._startPoint).multiplyScalar(0.5);
            this.setMidPoint(midPoint);
            var alpha = Math.atan2(this._endPoint.x - this._startPoint.x, this._endPoint.y - this._startPoint.y);
            function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : -1; }
            var beta = Math.atan2(this._endPoint.z - this._startPoint.z, Math.sqrt(Math.pow(this._endPoint.x - this._startPoint.x, 2) + Math.pow(this._endPoint.y - this._startPoint.y, 2)));
            this.setOrientation(alpha, beta);
        };
        Cylinder.prototype.setMidPoint = function (point) {
            this.pivot.position.set(point.x, point.y, point.z);
        };
        Cylinder.prototype.setOrientation = function (alpha, beta) {
            var orientation = new THREE.Matrix4();
            orientation.makeRotationFromEuler(new THREE.Euler(beta, alpha + this._angle, -alpha, "ZXY"));
            this.body.setRotationFromMatrix(orientation);
            //console.log(beta,-alpha, this.mesh.rotation.x,this.mesh.rotation.y,this.mesh.rotation.z)
            //this.mesh.rotation.set(beta, 0, -alpha);
        };
        return Cylinder;
    })();
    Objects.Cylinder = Cylinder;
})(Objects || (Objects = {}));
