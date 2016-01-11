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
            this.torso = new Solver.Torso();
            this.head = new Solver.Head();
            this.extremeties = {};
            var offset = this.torso.length() + this.head.length();
            this.extremeties[Extremeties.ARM_RIGHT.toString()] = new Solver.Arm(offset);
            offset += this.extremeties[Extremeties.ARM_RIGHT.toString()].length();
            this.extremeties[Extremeties.ARM_LEFT.toString()] = new Solver.Arm(offset);
            offset += this.extremeties[Extremeties.ARM_LEFT.toString()].length();
            this.extremeties[Extremeties.LEG_RIGHT.toString()] = new Solver.Leg(offset);
            offset += this.extremeties[Extremeties.LEG_RIGHT.toString()].length();
            this.extremeties[Extremeties.LEG_LEFT.toString()] = new Solver.Leg(offset); //offset += this.extremeties[Extremeties.ARM_RIGHT.toString()].length();
        }
        Body.prototype.evaluate = function (state) {
            var ret = this.torso.evaluate(state);
            var theta = state[0];
            var thetaDot = state[1];
            var thetaDotDot = ret[1];
            var phi = state[2];
            var phiDot = state[3];
            var phiDotDot = ret[3];
            var y = state[4];
            var ydot = state[5];
            var ydotdot = ret[5];
            var x = state[6];
            var xdot = state[7];
            var xdotdot = ret[7];
            this.head.setAcceleration(ydotdot);
            ret = ret.concat(this.head.evaluate(state));
            for (var entry in this.extremeties) {
                this.extremeties[entry].rotateAnchor(theta, thetaDot, thetaDotDot, phi, phiDot, phiDotDot, x, xdot, xdotdot, y, ydot, ydotdot);
                ret = ret.concat(this.extremeties[entry].evaluate(state));
            }
            return ret;
        };
        Body.prototype.length = function () {
            var retValue = this.torso.length() + this.head.length();
            for (var entry in this.extremeties) {
                retValue += this.extremeties[entry].length();
            }
            return retValue;
        };
        Body.prototype.setEulersAndAccelerations = function (alpha, beta, gamma, accelX, accelY, accelZ, mode) {
            this.head.setEulers(alpha, beta, gamma);
            this.torso.setEulers(alpha, beta, gamma);
            this.torso.setForces(accelX, accelY, accelZ);
            var sin = Math.sin(0 * alpha);
            var cos = Math.cos(0 * alpha);
            var tilt = Math.sin(gamma);
            switch (mode) {
                case Solver.Mode.LeftTwist:
                    for (var entry in this.extremeties) {
                        if (entry == Extremeties.LEG_LEFT) {
                            this.extremeties[Extremeties.LEG_LEFT].rotateSuspension(Math.sin(alpha + gamma), Math.cos(alpha + gamma), 0);
                        }
                        else
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
                        //if (entry == Extremeties.LEG_RIGHT)
                        //    height = Math.max(-30 * tilt, 0);
                        //if (entry == Extremeties.LEG_LEFT)
                        //    height = Math.max(30 * tilt, 0);
                        this.extremeties[entry].rotateSuspension(sin, cos, height);
                    }
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
