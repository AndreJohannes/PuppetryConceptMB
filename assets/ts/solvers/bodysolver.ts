/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />

module Solver {

    export enum Extremeties {
        ARM_RIGHT = 0,
        ARM_LEFT = 1,
        LEG_RIGHT = 2,
        LEG_LEFT = 3,
    }

    export class Body implements RungeKutta.Function {

        public torso: Torso = new Torso();
        public head: Head = new Head(this.torso.length());
        public extremeties: { [id: string]: Extremity } = {};

        constructor() {
            var offset = this.torso.length() + this.head.length();
            this.extremeties[Extremeties.ARM_RIGHT.toString()] = new Arm(offset); offset += this.extremeties[Extremeties.ARM_RIGHT.toString()].length();
            this.extremeties[Extremeties.ARM_LEFT.toString()] = new Arm(offset); offset += this.extremeties[Extremeties.ARM_LEFT.toString()].length();
            this.extremeties[Extremeties.LEG_RIGHT.toString()] = new Leg(offset); offset += this.extremeties[Extremeties.LEG_RIGHT.toString()].length();
            this.extremeties[Extremeties.LEG_LEFT.toString()] = new Leg(offset);//offset += this.extremeties[Extremeties.ARM_RIGHT.toString()].length();
        }

        evaluate(state: number[]): number[] {
            var ret: number[] = this.torso.evaluate(state);
            var theta = state[0]; var thetaDot = state[1]; var thetaDotDot = ret[1];
            var phi = state[2]; var phiDot = state[3]; var phiDotDot = ret[3];
            var psi = state[4]; var psiDot = state[5]; var psiDotDot = ret[5];
            var y = state[6]; var ydot = state[7]; var ydotdot = ret[7];
            var x = state[8]; var xdot = state[9]; var xdotdot = ret[9];
            var z = state[10]; var zdot = state[11]; var zdotdot = ret[11];
            this.head.setAcceleration(ydotdot);
            ret = ret.concat(this.head.evaluate(state));
            for (var entry in this.extremeties) {
                this.extremeties[entry]._rotateAnchor(theta, thetaDot, thetaDotDot,
                    -phi, -phiDot, -phiDotDot, -psi, -psiDot, -psiDotDot,
                    x, xdot, xdotdot, y, ydot, ydotdot, z, zdot, zdotdot);
                ret = ret.concat(this.extremeties[entry].evaluate(state));
            }
            return ret;
        }

        public length(): number {
            var retValue: number = this.torso.length() + this.head.length();
            for (var entry in this.extremeties) {
                retValue += this.extremeties[entry].length();
            }
            return retValue;
        }

        public setEulersAndAccelerations(alpha: number, beta: number, gamma: number,
            accelX: number, accelY: number, accelZ: number, mode: Mode) {
            this.head.setEulers(alpha + 0.0 * gamma, beta, -0.1 * gamma);
            this.torso.setEulers(alpha - 0.0 * gamma, beta, 0.1 * gamma);
            this.torso.setForces(accelX, accelY, accelZ);
            var sin = Math.sin(0 * alpha);
            var cos = Math.cos(0 * alpha);
            var tilt = Math.sin(gamma);
            switch (mode) {
                case Mode.LeftTwist:
                    for (var entry in this.extremeties) {
                        if (entry == Extremeties.LEG_LEFT) {
                            (<Leg>this.extremeties[Extremeties.LEG_LEFT]).pullKnee(20, Math.sin(gamma), Math.cos(gamma));
                        } else
                            this.extremeties[entry].rotateSuspension(sin, cos, 0);
                    }
                    this.extremeties[0].setInitialSuspension([-25 + 10 * gamma, 80, 50 + 25 * beta]);
                    this.extremeties[1].setInitialSuspension([25 + 10 * gamma, 80, 50 - 25 * beta]);
                    break;
               
                default:
                    for (var entry in this.extremeties) {
                        var height = 0;
                        if (entry == Extremeties.ARM_RIGHT)
                            height = 50 * tilt;
                        if (entry == Extremeties.ARM_LEFT)
                            height = 50 * tilt;
                        //if (entry == Extremeties.LEG_RIGHT)
                        //    height = Math.max(-30 * tilt, 0);
                        //if (entry == Extremeties.LEG_LEFT)
                        //    height = Math.max(30 * tilt, 0);
                        this.extremeties[entry].rotateSuspension(sin, cos, height);
                    }
            }
        }

        public setInitialSuspension(extremity: Extremeties, point: number[]) {
            this.extremeties[extremity.toString()].setInitialSuspension(point);
        }

        public setInitialAnchor(extremity: Extremeties, point: number[]) {
            this.extremeties[extremity.toString()].setInitialAnchor(point);
        }

        public setNominals(extremity: Extremeties, values: number[]) {
            this.extremeties[extremity.toString()].setNominals(values);
        }

    }



}