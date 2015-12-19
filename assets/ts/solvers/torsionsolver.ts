/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />

module Solver {

    export class Torsion implements RungeKutta.Function {

        private alpha: number = 0;

        evaluate(state: number[]): number[] {
            var theta = state[0];
            var thetadot = state[1];
            var k = 1;
            var d = 0.5;
            var thetadotdot = k * this.mod(this.alpha - theta) - d * thetadot;
            return [thetadot, thetadotdot];
        }

        public setAlpha(value: number) {
            this.alpha = value
        }

        private mod(value: number): number {
            var ret = value % (2 * Math.PI);
            if (ret > Math.PI)
                return ret - 2 * Math.PI;
            if (ret < (-Math.PI))
                return ret + 2 * Math.PI;
            return ret;
        }

    }

}

