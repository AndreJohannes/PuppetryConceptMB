/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />
var Solver;
(function (Solver) {
    (function (Extremeties) {
        Extremeties[Extremeties["ARM_RIGHT"] = 0] = "ARM_RIGHT";
        Extremeties[Extremeties["ARM_LEFT"] = 1] = "ARM_LEFT";
        Extremeties[Extremeties["LEG_RIGHT"] = 2] = "LEG_RIGHT";
        Extremeties[Extremeties["LEG_LEFT"] = 3] = "LEG_LEFT";
    })(Solver.Extremeties || (Solver.Extremeties = {}));
    var Extremeties = Solver.Extremeties;
    var Body = (function () {
        function Body() {
            this.torsion = new Solver.Torsion();
            this.extremeties = {};
            this.extremeties[Extremeties.ARM_RIGHT.toString()] = new Solver.Arm(2); // TODO: the values should not be hard coded
            this.extremeties[Extremeties.ARM_LEFT.toString()] = new Solver.Arm(20);
            this.extremeties[Extremeties.LEG_RIGHT.toString()] = new Solver.Leg(38);
            this.extremeties[Extremeties.LEG_LEFT.toString()] = new Solver.Leg(56);
        }
        Body.prototype.evaluate = function (state) {
            var ret = this.torsion.evaluate(state);
            var theta = state[0];
            var thetaDot = state[1];
            var thetaDotDot = ret[1];
            for (var entry in this.extremeties) {
                this.extremeties[entry].rotateAnchor(theta, thetaDot, thetaDotDot);
                ret = ret.concat(this.extremeties[entry].evaluate(state));
            }
            return ret;
        };
        Body.prototype.setAlpha = function (alpha, beta) {
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
        };
        Body.prototype.setInitialSuspension = function (extremity, point) {
            this.extremeties[extremity.toString()].setInitialSuspension(point);
        };
        Body.prototype.setInitialAnchor = function (extremity, point) {
            this.extremeties[extremity.toString()].setInitialAnchor(point);
        };
        Body.prototype.setNominals = function (extremity, values) {
            this.extremeties[extremity.toString()].setNominals(values);
        };
        return Body;
    })();
    Solver.Body = Body;
})(Solver || (Solver = {}));
