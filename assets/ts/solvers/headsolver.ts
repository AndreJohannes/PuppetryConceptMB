/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />

module Solver {

    enum EyeState {
        Started,
        Stop,
        Fading,
        Stopped
    }

    class LocationEye extends THREE.Vector3 {

        private up: THREE.Vector3;
        private left: THREE.Vector3;
        private center: THREE.Vector3;

        constructor(center: THREE.Vector3, up: THREE.Vector3, left: THREE.Vector3) {
            super(center.x, center.y, center.z);
            this.center = center;
            this.up = up;
            this.left = left;
        }

        setLocation(x: number, y: number) {
            this.x = this.center.x + x * this.left.x + y * this.up.x;
            this.y = this.center.y + x * this.left.y + y * this.up.y;
            this.z = this.center.z + x * this.left.z + y * this.up.z;
        }

    }

    export class Head implements RungeKutta.Function {

        public locLeftEye: LocationEye;
        public locRightEye: LocationEye;
        private radius: number = 3;
        private eyeState: EyeState = EyeState.Stopped;
        private offset: number = 12;
        private acceleration: number = 0;
        private alpha: number = 0;
        private beta: number = 0;
        private gamma: number = 0;

        constructor(offset: number) {
            this.offset = offset;
            var centerLeftEye = new THREE.Vector3(.38320 * 20, 0.04951 * 20, 0.73292 * 20);
            var upLeftEye = new THREE.Vector3(0.967638, 0., -0.252342);
            var leftLeftEye = new THREE.Vector3(0., 0.999691, -0.024849);
            this.locLeftEye = new LocationEye(centerLeftEye, upLeftEye, leftLeftEye);

            var centerRightEye = new THREE.Vector3(-.38320 * 20, 0.04951 * 20, 0.73292 * 20);
            var upRightEye = new THREE.Vector3(0.967638, 0., 0.252342);
            var leftRightEye = new THREE.Vector3(0., 0.999691, 0.024849);
            this.locRightEye = new LocationEye(centerRightEye, upRightEye, leftRightEye);

            //this._rollEyes(this, 0)();
        }

        public evaluate(state: number[]): number[] {
            var z: number = state[this.offset];
            var zdot: number = state[this.offset + 1];
            var k = 1;
            var d = 0.5;
            var zdotdot: number = -k * z - d * zdot + this.acceleration;
            var theta = state[this.offset + 2];
            var thetadot = state[this.offset + 3];
            var k = 1;
            var d = 0.5;
            var thetadotdot = k * MathUtils.mod(this.alpha - theta) - d * thetadot;
            var phi = state[this.offset + 4];
            var phidot = state[this.offset + 5];
            k = 1;
            d = 0.5;
            var phidotdot = k * MathUtils.mod(this.gamma - 2 * phi) - d * phidot;
            return [zdot, 0.4 * zdotdot, thetadot, thetadotdot, phidot, phidotdot];
        }

        public length(): number {
            return 6;
        }

        public setAcceleration(accelertion: number) {
            this.acceleration = accelertion;
        }

        public setEulers(alpha: number, beta: number, gamma: number) {
            this.alpha = alpha;
            this.beta = beta;
            this.gamma = gamma;
        }

        public rollEyes() {
            if (this.eyeState != EyeState.Stopped)
                return;
            this.eyeState = EyeState.Started;
            this._rollEyes(this, 0)();
        }

        public stopEyes() {
            this.eyeState = EyeState.Stop;
        }

        private _rollEyes(that: Head, time: number, stopTime: number = -1, vertical: boolean = false) {
            return function() {
                var x = that.radius * Math.cos(time);
                var y = that.radius * Math.sin(time);
                switch (that.eyeState) {
                    case EyeState.Started:
                        if (time < Math.PI / 2) {
                            x = x * Math.sin(time);
                            y = y * Math.sin(time);
                        }
                        break;
                    case EyeState.Stop:
                        stopTime = time;
                        that.eyeState = EyeState.Fading;
                        break;
                    case EyeState.Fading:
                        if ((time - stopTime) < Math.PI / 2) {
                            x = x * Math.cos(time - stopTime);
                            y = y * Math.cos(time - stopTime);
                        }
                        else {
                            that.eyeState = EyeState.Stopped;
                            return;
                        }
                        break;
                }
                that.locLeftEye.setLocation(vertical ? 0 : x, y);
                that.locRightEye.setLocation(vertical ? 0 : x, y);
                setTimeout(that._rollEyes(that, time + 0.1, stopTime), 17);
            };
        }


    }

}