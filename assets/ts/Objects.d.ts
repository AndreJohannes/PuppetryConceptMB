/// <reference path="three.d.ts" />
declare module Objects {
    class Sphere {
        private scene;
        private mesh;
        private _centerPoint;
        constructor(scene: THREE.Object3D, radius?: number);
        centerPoint: THREE.Vector3;
    }
    class Cylinder {
        private pivot;
        private mesh;
        private _startPoint;
        private _endPoint;
        constructor(scene: THREE.Object3D, height: number);
        startPoint: THREE.Vector3;
        endPoint: THREE.Vector3;
        private updatePositionAndOrientation();
        private setMidPoint(point);
        private setOrientation(alpha, beta);
    }
}
