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
            dx: number, dxdot: number, dxdotdot: number,
            dy: number, dydot: number, dydotdot: number,
            dz: number, dzdot: number, dzdotdot: number) {
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
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
            this.rotatedAnchor.x = x + dx;
            this.rotatedAnchor.y = y + dy;
            this.rotatedAnchor.z = z + dz;
            this.rotatedAnchor.xdot = xdot + dxdot;
            this.rotatedAnchor.ydot = ydot + dydot;
            this.rotatedAnchor.zdot = zdot + dzdot;
            this.rotatedAnchor.xdotdot = xdotdot + dxdotdot;
            this.rotatedAnchor.ydotdot = ydotdot + dydotdot;
            this.rotatedAnchor.zdotdot = zdotdot + dzdotdot;
        }

        public _rotateAnchor(theta: number, thetaDot: number, thetaDotDot: number,
            phi: number, phiDot: number, phiDotDot: number,
            psi: number, psiDot: number, psiDotDot: number,
            dx: number, dxdot: number, dxdotdot: number,
            dy: number, dydot: number, dydotdot: number,
            dz: number, dzdot: number, dzdotdot: number) {
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
            var sinPsi = Math.sin(psi);
            var cosPsi = Math.cos(psi);
            var apx = this.initialAnchor.x;
            var apy = this.initialAnchor.y;
            var apz = this.initialAnchor.z;
            var x = (apx * sinPhi * sinPsi - apy * cosPsi * sinPhi + apz * cosPhi) * sinTheta + apy * cosTheta * sinPsi + apx * cosPsi * cosTheta;
            var y = (-apx * cosPhi * sinPsi) + apz * sinPhi + apy * cosPhi * cosPsi;
            var z = ((-apy * sinPsi) - apx * cosPsi) * sinTheta + apx * cosTheta * sinPhi * sinPsi - apy * cosPsi * cosTheta * sinPhi + apz * cosPhi * cosTheta;
            var RThetaDotRPhiRPsix = RThetaDotRPhiRPsix = ((-apy * sinPsi) - apx * cosPsi) * sinTheta + apx * cosTheta * sinPhi * sinPsi - apy * cosPsi * cosTheta * sinPhi + apz * cosPhi * cosTheta;
            var RThetaDotRPhiRPsiy = 0;
            var RThetaDotRPhiRPsiz = ((-apx * sinPhi * sinPsi) + apy * cosPsi * sinPhi - apz * cosPhi) * sinTheta - apy * cosTheta * sinPsi - apx * cosPsi * cosTheta;
            var RThetaRPhiDotRPsix = (apx * cosPhi * sinPsi - apz * sinPhi - apy * cosPhi * cosPsi) * sinTheta;
            var RThetaRPhiDotRPsiy = apx * sinPhi * sinPsi - apy * cosPsi * sinPhi + apz * cosPhi;
            var RThetaRPhiDotRPsiz = apx * cosPhi * cosTheta * sinPsi - apz * cosTheta * sinPhi - apy * cosPhi * cosPsi * cosTheta;
            var RThetaRPhiRPsiDotx = (apy * sinPhi * sinPsi + apx * cosPsi * sinPhi) * sinTheta - apx * cosTheta * sinPsi + apy * cosPsi * cosTheta;
            var RThetaRPhiRPsiDoty = (-apy * cosPhi * sinPsi) - apx * cosPhi * cosPsi;
            var RThetaRPhiRPsiDotz = (apx * sinPsi - apy * cosPsi) * sinTheta + apy * cosTheta * sinPhi * sinPsi + apx * cosPsi * cosTheta * sinPhi;

            var RThetaDotRPhiDotRPsix = apx * cosPhi * cosTheta * sinPsi - apz * cosTheta * sinPhi - apy * cosPhi * cosPsi * cosTheta;
            var RThetaDotRPhiDotRPsiy = 0;
            var RThetaDotRPhiDotRPsiz = ((-apx * cosPhi * sinPsi) + apz * sinPhi + apy * cosPhi * cosPsi) * sinTheta;
            var RThetaDotRPhiRPsiDotx = (apy * sinPsi ** 2 + 2 * apx * cosPsi * sinPsi - apy * cosPsi ** 2) * sinTheta;
            var RThetaDotRPhiRPsiDoty = 0;
            var RThetaDotRPhiRPsiDotz = apy * cosTheta * sinPsi ** 2 + 2 * apx * cosPsi * cosTheta * sinPsi - apy * cosPsi ** 2 * cosTheta;
            var RThetaRPhiDotRPsiDotx = (apy * cosPhi * sinPsi + apx * cosPhi * cosPsi) * sinTheta;
            var RThetaRPhiDotRPsiDoty = apy * sinPhi * sinPsi + apx * cosPsi * sinPhi;
            var RThetaRPhiDotRPsiDotz = apy * cosPhi * cosTheta * sinPsi + apx * cosPhi * cosPsi * cosTheta;

            var RThetaDotDotRPhiRPsix = ((-apx * sinPhi * sinPsi) + apy * cosPsi * sinPhi - apz * cosPhi) * sinTheta - apy * cosTheta * sinPsi - apx * cosPsi * cosTheta;
            var RThetaDotDotRPhiRPsiy = 0;
            var RThetaDotDotRPhiRPsiz = (apy * sinPsi + apx * cosPsi) * sinTheta - apx * cosTheta * sinPhi * sinPsi + apy * cosPsi * cosTheta * sinPhi - apz * cosPhi * cosTheta;
            var RThetaRPhiDotDotRPsix = ((-apx * sinPhi * sinPsi) + apy * cosPsi * sinPhi - apz * cosPhi) * sinTheta;
            var RThetaRPhiDotDotRPsiy = apx * cosPhi * sinPsi - apz * sinPhi - apy * cosPhi * cosPsi;
            var RThetaRPhiDotDotRPsiz = (-apx * cosTheta * sinPhi * sinPsi) + apy * cosPsi * cosTheta * sinPhi - apz * cosPhi * cosTheta;
            var RThetaRPhiRPsiDotDotx = (apy * cosPsi * sinPhi - apx * sinPhi * sinPsi) * sinTheta - apy * cosTheta * sinPsi - apx * cosPsi * cosTheta;
            var RThetaRPhiRPsiDotDoty = apx * cosPhi * sinPsi - apy * cosPhi * cosPsi;
            var RThetaRPhiRPsiDotDotz = (apy * sinPsi + apx * cosPsi) * sinTheta - apx * cosTheta * sinPhi * sinPsi + apy * cosPsi * cosTheta * sinPhi;

            var xdot = thetaDot * RThetaDotRPhiRPsix + phiDot * RThetaRPhiDotRPsix + psiDot * RThetaRPhiRPsiDotx;
            var ydot = thetaDot * RThetaDotRPhiRPsiy + phiDot * RThetaRPhiDotRPsiy + psiDot * RThetaRPhiRPsiDoty;
            var zdot = thetaDot * RThetaDotRPhiRPsiz + phiDot * RThetaRPhiDotRPsiz + psiDot * RThetaRPhiRPsiDotz;
            var xdotdot = RThetaDotRPhiRPsix * thetaDotDot + RThetaDotDotRPhiRPsix * thetaDot ** 2 + (2 * RThetaDotRPhiRPsiDotx * psiDot + 2 * RThetaDotRPhiDotRPsix * phiDot) * thetaDot +
                RThetaRPhiRPsiDotx * psiDotDot + RThetaRPhiRPsiDotDotx * psiDot ** 2 + 2 * RThetaRPhiDotRPsiDotx * phiDot * psiDot + RThetaRPhiDotRPsix * phiDotDot + RThetaRPhiDotDotRPsix * phiDot ** 2;
            var ydotdot = RThetaDotRPhiRPsiy * thetaDotDot + RThetaDotDotRPhiRPsiy * thetaDot ** 2 + (2 * RThetaDotRPhiRPsiDoty * psiDot + 2 * RThetaDotRPhiDotRPsiy * phiDot) * thetaDot +
                RThetaRPhiRPsiDoty * psiDotDot + RThetaRPhiRPsiDotDoty * psiDot ** 2 + 2 * RThetaRPhiDotRPsiDoty * phiDot * psiDot + RThetaRPhiDotRPsiy * phiDotDot + RThetaRPhiDotDotRPsiy * phiDot ** 2;;
            var zdotdot = RThetaDotRPhiRPsiz * thetaDotDot + RThetaDotDotRPhiRPsiz * thetaDot ** 2 + (2 * RThetaDotRPhiRPsiDotz * psiDot + 2 * RThetaDotRPhiDotRPsiz * phiDot) * thetaDot +
                RThetaRPhiRPsiDotz * psiDotDot + RThetaRPhiRPsiDotDotz * psiDot ** 2 + 2 * RThetaRPhiDotRPsiDotz * phiDot * psiDot + RThetaRPhiDotRPsiz * phiDotDot + RThetaRPhiDotDotRPsiz * phiDot ** 2;
            this.rotatedAnchor.x = x + dx;
            this.rotatedAnchor.y = y + dy;
            this.rotatedAnchor.z = z + dz;
            this.rotatedAnchor.xdot = xdot + dxdot;
            this.rotatedAnchor.ydot = ydot + dydot;
            this.rotatedAnchor.zdot = zdot + dzdot;
            this.rotatedAnchor.xdotdot = xdotdot + dxdotdot;
            this.rotatedAnchor.ydotdot = ydotdot + dydotdot;
            this.rotatedAnchor.zdotdot = zdotdot + dzdotdot;
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
            this.rotatedSuspension.x = x * cos + z * sin + (x < 0 ? height : -height);
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

        abstract length(): number;

    }

}