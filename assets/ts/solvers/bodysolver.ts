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

        public torsion: Torsion = new Torsion();
        public extremeties: { [id: string]: Extremity } = {};

        constructor() {
            this.extremeties[Extremeties.ARM_RIGHT.toString()] = new Arm(2);// TODO: the values should not be hard coded
            this.extremeties[Extremeties.ARM_LEFT.toString()] = new Arm(20);
            this.extremeties[Extremeties.LEG_RIGHT.toString()] = new Leg(38);
            this.extremeties[Extremeties.LEG_LEFT.toString()] = new Leg(56);
        }

        evaluate(state: number[]): number[] {
            var ret: number[] = this.torsion.evaluate(state);
            var theta = state[0];
            var thetaDot = state[1];
            var thetaDotDot = ret[1];
            for (var entry in this.extremeties) {
                this.extremeties[entry].rotateAnchor(theta, thetaDot, thetaDotDot);
                ret = ret.concat(this.extremeties[entry].evaluate(state));
            }
            return ret;
        }

        public setAlpha(alpha: number, beta: number) {
            this.torsion.setAlpha(alpha);
            var sin = Math.sin(alpha);
            var cos = Math.cos(alpha);
            var tilt = Math.sin(beta);
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