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
        public extremeties: { [id: string]: Extremity } = {};

        constructor() {
            this.extremeties[Extremeties.ARM_RIGHT.toString()] = new Arm(6);// TODO: the values should not be hard coded
            this.extremeties[Extremeties.ARM_LEFT.toString()] = new Arm(24);
            this.extremeties[Extremeties.LEG_RIGHT.toString()] = new Leg(42);
            this.extremeties[Extremeties.LEG_LEFT.toString()] = new Leg(60);
        }

        evaluate(state: number[]): number[] {
            var ret: number[] = this.torso.evaluate(state);
            var theta = state[0];
            var thetaDot = state[1];
            var thetaDotDot = ret[1];
            var phi = state[2];
            var phiDot = state[3];
            var phiDotDot = ret[3];
            var y = state[4];
            var ydot = state[5];
            var ydotdot = ret[5];
            for (var entry in this.extremeties) {
                this.extremeties[entry].rotateAnchor(theta, thetaDot, thetaDotDot,
                    phi, phiDot, phiDotDot, y, ydot, ydotdot);
                ret = ret.concat(this.extremeties[entry].evaluate(state));
            }
            return ret;
        }

        public setEulersAndAcceleration(alpha: number, beta: number, gamma: number,
            acceleration: number, mode: Mode) {
            this.torso.setAlphaBetaAndForce(alpha, beta, acceleration);
            var sin = Math.sin(alpha);
            var cos = Math.cos(alpha);
            var tilt = Math.sin(gamma);
            switch (mode) {
                case Mode.LeftTwist:
                    for (var entry in this.extremeties) {
                        if (entry == Extremeties.LEG_LEFT) {
                            this.extremeties[Extremeties.LEG_LEFT].rotateSuspension(Math.sin(alpha + gamma), Math.cos(alpha + gamma),0);
                        } else
                            this.extremeties[entry].rotateSuspension(sin, cos, 0);
                    }
                    break;
                default:
                    for (var entry in this.extremeties) {
                        var height = 0;
                        if (entry == Extremeties.ARM_RIGHT)
                            height = 50 * tilt;
                        if (entry == Extremeties.ARM_LEFT)
                            height = -50 * tilt;
                        if (entry == Extremeties.LEG_RIGHT)
                            height = Math.max(-30 * tilt, 0);
                        if (entry == Extremeties.LEG_LEFT)
                            height = Math.max(30 * tilt, 0);
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