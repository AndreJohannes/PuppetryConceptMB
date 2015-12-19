/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />

module Solver {

    export abstract class Extremity implements RungeKutta.Function {

        protected offset: number;
        private initialAnchor = { "x": 0, "y": 0, "z": 0 };
        protected rotatedAnchor = { "x": 0, "y": 0, "z": 0, "xdot": 0, "ydot": 0, "zdot": 0, "xdotdot": 0, "ydotdot": 0, "zdotdot": 0 };
        private initialSuspension = { "x": 0, "y": 0, "z": 0 };
        protected rotatedSuspension = { "x": 0, "y": 0, "z": 0 };
        protected nominalLength = { "upper": 0, "lower": 0, "string": 0 };

        public setInitialAnchor(value: number[]) {
            this.initialAnchor.x = value[0];
            this.initialAnchor.y = value[1];
            this.initialAnchor.z = value[2];
            this.rotatedAnchor.x = value[0];
            this.rotatedAnchor.y = value[1];
            this.rotatedAnchor.z = value[2];
        }

        public getRotatedAnchor(): THREE.Vector3 {
            return (new THREE.Vector3(this.rotatedAnchor.x, this.rotatedAnchor.y, this.rotatedAnchor.z));
        }

        public rotateAnchor(theta: number, thetaDot: number, thetaDotDot: number) {
            var sin = Math.sin(theta);
            var cos = Math.cos(theta);
            var x = this.initialAnchor.x * cos + this.initialAnchor.z * sin;
            var y = this.initialAnchor.y;
            var z = -this.initialAnchor.x * sin + this.initialAnchor.z * cos;;
            var xdot = thetaDot * (-this.initialAnchor.x * sin + this.initialAnchor.z * cos);
            var zdot = thetaDot * (-this.initialAnchor.x * cos - this.initialAnchor.z * sin);
            var xdotdot = -x * thetaDot * thetaDot + thetaDotDot * xdot;
            var zdotdot = -z * thetaDot * thetaDot + thetaDotDot * zdot;
            this.rotatedAnchor.x = x;
            this.rotatedAnchor.y = y;
            this.rotatedAnchor.z = z;
            this.rotatedAnchor.xdot = xdot;
            this.rotatedAnchor.ydot = 0;
            this.rotatedAnchor.zdot = zdot;
            this.rotatedAnchor.xdotdot = xdotdot;
            this.rotatedAnchor.ydotdot = 0;
            this.rotatedAnchor.zdotdot = zdotdot;
        }

        public setInitialSuspension(value: number[]) {
            this.initialSuspension.x = value[0];
            this.initialSuspension.y = value[1];
            this.initialSuspension.z = value[2];
            this.rotatedSuspension.x = value[0];
            this.rotatedSuspension.y = value[1];
            this.rotatedSuspension.z = value[2];
        }

        public rotateSuspension(sin: number, cos: number, height: number) {
            var x = this.initialSuspension.x;
            var y = this.initialSuspension.y;
            var z = this.initialSuspension.z;
            this.rotatedSuspension.x = x * cos + z * sin;
            this.rotatedSuspension.y = y + height;
            this.rotatedSuspension.z = z * cos - x * sin;
        }

        public setNominals(values: number[]) {
            this.nominalLength.upper = values[0];
            this.nominalLength.lower = values[1];
            this.nominalLength.string = values[2];
        }

        constructor(offset: number) {
            this.offset = offset;
        }

        abstract evaluate(state: number[]): number[];



    }

}