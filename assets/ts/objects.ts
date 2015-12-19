/// <reference path="three.d.ts" />
module Objects {

    export class Sphere {

        private scene: THREE.Scene;
        private mesh: THREE.Mesh;
        private _centerPoint: THREE.Vector3;

        constructor(scene: THREE.Object3D, radius: number = 5) {
            var sphere: THREE.SphereGeometry = new THREE.SphereGeometry(radius);
            var material: THREE.Material = new THREE.MeshPhongMaterial({
                emissive: 0x000000
            });
            this.mesh = new THREE.Mesh(sphere, material);
            this.mesh.castShadow = true;
            scene.add(this.mesh);
        }

        set centerPoint(point: THREE.Vector3) {
            this._centerPoint = point;
            this.mesh.position.set(point.x, point.y, point.z);
        }
        
        get centerPoint():THREE.Vector3{
            return this._centerPoint;    
        }

    }

    export class Cylinder {

        //private scene: THREE.Scene;
        private pivot: THREE.Object3D;
        private mesh: THREE.Mesh;
        private _startPoint: THREE.Vector3;
        private _endPoint: THREE.Vector3;

        constructor(scene: THREE.Object3D, height: number) {
            //this.scene = scene;
            var cylinder = new THREE.CylinderGeometry(3.5, 3.5, height);
            var material = new THREE.MeshPhongMaterial({
                emissive: 0x000000,
            });
            this.mesh = new THREE.Mesh(cylinder, material);
            this.mesh.castShadow = true;
            this.pivot = new THREE.Object3D();
            this.pivot.add(this.mesh);
            scene.add(this.pivot);
        }

        set startPoint(point: THREE.Vector3) {
            this._startPoint = point;
            this.updatePositionAndOrientation();
        }

        set endPoint(point: THREE.Vector3) {
            this._endPoint = point;
            this.updatePositionAndOrientation();
        }

        private updatePositionAndOrientation() {
            if (this._startPoint == null || this._endPoint == null)
                return;
            var midPoint = this._endPoint.clone().add(this._startPoint).multiplyScalar(0.5);
            this.setMidPoint(midPoint);

            var alpha: number = Math.atan2(this._endPoint.x - this._startPoint.x, this._endPoint.y - this._startPoint.y);
            function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : -1; }
            var beta: number = Math.atan2(this._endPoint.z - this._startPoint.z, Math.sqrt(Math.pow(this._endPoint.x - this._startPoint.x, 2) + Math.pow(this._endPoint.y - this._startPoint.y, 2)));
            this.setOrientation(alpha, beta);
        }

        private setMidPoint(point: THREE.Vector3) {
            this.pivot.position.set(point.x, point.y, point.z);
        }

        private setOrientation(alpha: number, beta: number) {
            var orientation: THREE.Matrix4 = new THREE.Matrix4();
            orientation.makeRotationFromEuler(new THREE.Euler(beta, 0, -alpha, "ZYX"));
            this.mesh.setRotationFromMatrix(orientation);
            //console.log(beta,-alpha, this.mesh.rotation.x,this.mesh.rotation.y,this.mesh.rotation.z)
            //this.mesh.rotation.set(beta, 0, -alpha);
        }

    }
}