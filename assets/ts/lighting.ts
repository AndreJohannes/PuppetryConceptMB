/// <reference path="three.d.ts" />

module Lighting {

    export class Lighting {

        private scene: THREE.Scene;
        private lightRed: THREE.SpotLight;
        private lightGreen: THREE.SpotLight;
        private lightBlue: THREE.SpotLight;
        private targetRed: THREE.Object3D;
        private targetGreen: THREE.Object3D;
        private targetBlue: THREE.Object3D;
        private ambientLight: THREE.AmbientLight;

        private started: boolean = false;

        constructor(scene: THREE.Scene) {
            this.scene = scene;
            this.lightRed = <THREE.SpotLight>scene.getObjectByName("SpotLight1");
            this.lightGreen = <THREE.SpotLight>scene.getObjectByName("SpotLight2");
            this.lightBlue = <THREE.SpotLight>scene.getObjectByName("SpotLight3");
            this.ambientLight = <THREE.AmbientLight>scene.getObjectByName("AmbientLight");
            this.targetRed = new THREE.Object3D();
            this.lightRed.target = this.targetRed;
            this.targetGreen = new THREE.Object3D();
            this.lightGreen.target = this.targetGreen;
            this.targetBlue = new THREE.Object3D();
            this.lightBlue.target = this.targetBlue;
            this.targetRed.position.y = 100;
            this.targetGreen.position.y = 100;
            this.targetBlue.position.y = 100;
            this.ambientLight.color = new THREE.Color(0.4, 0.4, 0.4);
            this.lightRed.color = new THREE.Color(0.8, 0.2, 0.2);
            this.lightGreen.color = new THREE.Color(0.2, 0.8, 0.2);
            this.lightBlue.color = new THREE.Color(0.2, 0.2, 0.8);
            scene.add(this.targetRed);
            scene.add(this.targetGreen);
            scene.add(this.targetBlue);
        }

        public start() {
            if (this.started)
                return
            this._animate(this, 0, 0)();
            this.started = true;
        }

        private _animate(that: Lighting.Lighting, time: number, rot: number) {
            return function() {
                var x = 100 * Math.cos(time) / (1 + Math.sin(time) ** 2);
                var y = 100 * Math.sin(time) * Math.cos(time) / (1 + Math.sin(time) ** 2);
                that.targetRed.position.x = Math.cos(rot) * x - Math.sin(rot) * y;
                that.targetRed.position.z = Math.cos(rot) * y + Math.sin(rot) * x;
                that.targetGreen.position.z = x;
                that.targetGreen.position.x = -y;
                that.lightBlue.intensity = 0.5 + Math.cos(time) / 2;
                //that.targetBlue.position.x = 100 * Math.cos(time);
                //that.targetBlue.position.z = 100 * Math.cos(time);
                setTimeout(that._animate(that, time + 0.05, rot + 0.01 * (0.5 - (Math.random()))), 17);
            };
        }

    }

}