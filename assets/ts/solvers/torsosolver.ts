/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />

module Solver {

    export class Torso implements RungeKutta.Function {

        private alpha: number = 0;
        private beta: number = 0;
        private gamma: number = 0;
        private force = { x: 0, y: 0, z: 0 };

        evaluate(state: number[]): number[] {
            var theta = state[0];
            var thetadot = state[1];
            var phi = state[2];
            var phidot = state[3];
            var z = state[4];
            var zdot = state[5];
            var x = state[6];
            var xdot = state[7];
            var y = state[8];
            var ydot = state[9];

            var k = 1; var d = 0.5;
            var thetadotdot = k * MathUtils.mod(this.alpha - theta) - d * thetadot;
            k = 1; d = 0.5;
            var phidotdot = k * MathUtils.mod(this.beta - phi) - d * phidot;
            k = z > 0 ? .5 : 3; d = 0.5;
            var force = MathUtils.tanh(- k * z + this.force.z);
            var zdotdot = force - d * zdot;
            k = 1; d = 0.5;
            force = MathUtils.tanh(- k * x + this.force.x);
            var xdotdot = force - d * xdot;
            k = 1; d = 0.5;
            force = MathUtils.tanh(- k * y + this.force.y);
            var ydotdot = force - d * ydot;

            return [thetadot, thetadotdot, phidot, phidotdot, zdot, zdotdot, xdot, xdotdot, ydot, ydotdot];
        }

        public length(): number {
            return 10
        }

        public setAlphaBetaAndForce(alpha: number, beta: number, force: number) {
            this.alpha = alpha;
            this.beta = beta;
            this.force.z = force;
        }

        public setEulers(alpha: number, beta: number, gamma: number) {
            this.alpha = alpha;
            this.beta = beta;
            this.gamma = gamma;
        }

        public setForces(forceX: number, forceY: number, forceZ: number) {
            this.force.x = forceX;
            this.force.y = forceY;
            this.force.z = forceZ;
        }


    }

}

