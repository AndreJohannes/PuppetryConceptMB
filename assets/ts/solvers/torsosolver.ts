/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />

module Solver {

    export class Torso implements RungeKutta.Function {

        private alpha: number = 0;
        private beta: number = 0;
        private force: number = 0;

        evaluate(state: number[]): number[] {
            var theta = state[0];
            var thetadot = state[1];
            var phi = state[2];
            var phidot = state[3];
            var z = state[4];
            var zdot = state[5];
            var k = 1;
            var d = 0.5;
            var thetadotdot = k * this.mod(this.alpha - theta) - d * thetadot;
            k = 1;
            d = 0.5;
            var phidotdot = k * this.mod(this.beta - phi) - d * phidot;
            k = 1;
            d = 0.5;
            var zdotdot = - k * z - d * zdot + this.force;
            return [thetadot, thetadotdot, phidot, phidotdot, zdot, zdotdot];
        }

        public setAlphaBetaAndForce(alpha: number, beta: number, force : number) {
            this.alpha = alpha;
            this.beta = beta;
            this.force = force;
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

