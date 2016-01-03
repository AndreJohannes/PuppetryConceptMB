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

        public rotateAnchor(theta: number, thetaDot: number, thetaDotDot: number,
            phi: number, phiDot: number, phiDotDot: number,
            dy: number, dydot: number, dydotdot: number) {
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var sinPhi = Math.sin(-phi);
            var cosPhi = Math.cos(-phi);
            var apx = this.initialAnchor.x;
            var apy = this.initialAnchor.y;
            var apz = this.initialAnchor.z;
            var x = apx * cosTheta - apy * sinTheta * sinPhi + apz * cosPhi * sinTheta;
            var y = apy * cosPhi + apz * sinPhi;
            var z = -apx * sinTheta - apy * cosTheta * sinPhi + apz * cosTheta * cosPhi;
            //var RThetaRPhix = (apz * cosPhi - apy * sinPhi) * sinTheta + apx * cosTheta;
            //var RThetaRPhiy = apz * sinPhi + apy * cosPhi;
            //var RThetaRPhiz = (-apx * sinTheta) - apy * cosTheta * sinPhi + apz * cosPhi * cosTheta;
            var RThetaDotRPhix = (-apx * sinTheta) - apy * cosTheta * sinPhi + apz * cosPhi * cosTheta;
            var RThetaDotRPhiy = 0;
            var RThetaDotRPhiz = (apy * sinPhi - apz * cosPhi) * sinTheta - apx * cosTheta;
            var RThetaRPhiDotx = ((-apz * sinPhi) - apy * cosPhi) * sinTheta;
            var RThetaRPhiDoty = apz * cosPhi - apy * sinPhi;
            var RThetaRPhiDotz = (-apz * cosTheta * sinPhi) - apy * cosPhi * cosTheta;
            var RThetaDotRPhiDotx = (-apz * cosTheta * sinPhi) - apy * cosPhi * cosTheta;
            var RThetaDotRPhiDoty = 0;
            var RThetaDotRPhiDotz = (apz * sinPhi + apy * cosPhi) * sinTheta;
            var RThetaDotDotRPhix = (apy * sinPhi - apz * cosPhi) * sinTheta - apx * cosTheta;
            var RThetaDotDotRPhiy = 0;
            var RThetaDotDotRPhiz = apx * sinTheta + apy * cosTheta * sinPhi - apz * cosPhi * cosTheta;
            var RThetaRPhiDotDotx = (apy * sinPhi - apz * cosPhi) * sinTheta;
            var RThetaRPhiDotDoty = (-apz * sinPhi) - apy * cosPhi;
            var RThetaRPhiDotDotz = apy * cosTheta * sinPhi - apz * cosPhi * cosTheta;

            var xdot = thetaDot * RThetaDotRPhix + phiDot * RThetaRPhiDotx;
            var ydot = thetaDot * RThetaDotRPhiy + phiDot * RThetaRPhiDoty;
            var zdot = thetaDot * RThetaDotRPhiz + phiDot * RThetaRPhiDotz;
            var xdotdot = RThetaDotRPhix * thetaDotDot + RThetaRPhiDotx * phiDotDot + 2 * RThetaDotRPhiDotx * phiDot * thetaDot + RThetaDotDotRPhix * thetaDot ** 2 + RThetaRPhiDotDotx * phiDot ** 2;
            var ydotdot = RThetaDotRPhiy * thetaDotDot + RThetaRPhiDoty * phiDotDot + 2 * RThetaDotRPhiDoty * phiDot * thetaDot + RThetaDotDotRPhiy * thetaDot ** 2 + RThetaRPhiDotDoty * phiDot ** 2;
            var zdotdot = RThetaDotRPhiz * thetaDotDot + RThetaRPhiDotz * phiDotDot + 2 * RThetaDotRPhiDotz * phiDot * thetaDot + RThetaDotDotRPhiz * thetaDot ** 2 + RThetaRPhiDotDotz * phiDot ** 2;
            this.rotatedAnchor.x = x;
            this.rotatedAnchor.y = y + dy;
            this.rotatedAnchor.z = z;
            this.rotatedAnchor.xdot = xdot;
            this.rotatedAnchor.ydot = ydot + dydot;
            this.rotatedAnchor.zdot = zdot;
            this.rotatedAnchor.xdotdot = xdotdot;
            this.rotatedAnchor.ydotdot = ydotdot + dydotdot;
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