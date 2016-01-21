/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />
var Solver;
(function (Solver) {
    var Torso = (function () {
        function Torso() {
            this.alpha = 0;
            this.beta = 0;
            this.gamma = 0;
            this.force = { x: 0, y: 0, z: 0 };
        }
        Torso.prototype.evaluate = function (state) {
            var theta = state[0];
            var thetadot = state[1];
            var phi = state[2];
            var phidot = state[3];
            var psi = state[4];
            var psidot = state[5];
            var z = state[6];
            var zdot = state[7];
            var x = state[8];
            var xdot = state[9];
            var y = state[10];
            var ydot = state[11];
            var k = 1;
            var d = 0.5;
            var thetadotdot = k * MathUtils.mod(this.alpha - theta) - d * thetadot;
            k = 1;
            d = 0.5;
            var phidotdot = k * MathUtils.mod(this.beta - phi) - d * phidot;
            k = 1;
            d = 0.5;
            var psidotdot = k * MathUtils.mod(this.gamma - 2 * psi) - d * psidot;
            k = z > 0 ? .5 : 3;
            d = 0.5;
            var force = 3 * MathUtils.tanh((-k * z + this.force.z) / 2);
            var zdotdot = force - d * zdot;
            k = 1;
            d = 0.5;
            force = MathUtils.tanh(-k * x + this.force.x);
            var xdotdot = force - d * xdot;
            k = 1;
            d = 0.5;
            force = MathUtils.tanh(-k * y + this.force.y);
            var ydotdot = (force - d * ydot);
            return [thetadot, thetadotdot, phidot, phidotdot,
                psidot, psidotdot,
                zdot, zdotdot, xdot, xdotdot, ydot, ydotdot];
        };
        Torso.prototype.length = function () {
            return 12;
        };
        Torso.prototype.setAlphaBetaAndForce = function (alpha, beta, force) {
            this.alpha = alpha;
            this.beta = beta;
            this.force.z = force;
        };
        Torso.prototype.setEulers = function (alpha, beta, gamma) {
            this.alpha = alpha;
            this.beta = beta;
            this.gamma = gamma;
        };
        Torso.prototype.setForces = function (forceX, forceY, forceZ) {
            this.force.x = forceX;
            this.force.y = forceY;
            this.force.z = forceZ;
        };
        return Torso;
    })();
    Solver.Torso = Torso;
})(Solver || (Solver = {}));
