/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />
var Solver;
(function (Solver) {
    var Torsion = (function () {
        function Torsion() {
            this.alpha = 0;
        }
        Torsion.prototype.evaluate = function (state) {
            var theta = state[0];
            var thetadot = state[1];
            var k = 1;
            var d = 0.5;
            var thetadotdot = k * this.mod(this.alpha - theta) - d * thetadot;
            return [thetadot, thetadotdot];
        };
        Torsion.prototype.setAlpha = function (value) {
            this.alpha = value;
        };
        Torsion.prototype.mod = function (value) {
            var ret = value % (2 * Math.PI);
            if (ret > Math.PI)
                return ret - 2 * Math.PI;
            if (ret < (-Math.PI))
                return ret + 2 * Math.PI;
            return ret;
        };
        return Torsion;
    })();
    Solver.Torsion = Torsion;
})(Solver || (Solver = {}));
