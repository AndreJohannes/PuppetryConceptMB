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
            this.head = new Solver.Head(this.torso.length());
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
            var psi = state[4];
            var psiDot = state[5];
            var psiDotDot = ret[5];
            var y = state[6];
            var ydot = state[7];
            var ydotdot = ret[7];
            var x = state[8];
            var xdot = state[9];
            var xdotdot = ret[9];
            var z = state[10];
            var zdot = state[11];
            var zdotdot = ret[11];
            this.head.setAcceleration(ydotdot);
            ret = ret.concat(this.head.evaluate(state));
            for (var entry in this.extremeties) {
                this.extremeties[entry]._rotateAnchor(theta, thetaDot, thetaDotDot, -phi, -phiDot, -phiDotDot, -psi, -psiDot, -psiDotDot, x, xdot, xdotdot, y, ydot, ydotdot, z, zdot, zdotdot);
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
        Body.prototype.setEulersAndAccelerations = function (alpha, beta, gamma, 
            // TODO: very experimental, clean up 
            accelX, accelY, accelZ, twist, moveLA, moveRA) {
            this.head.setEulers(alpha + 0.0 * gamma, -beta, -gamma);
            if (twist)
                this.torso.setEulers(0.1 * alpha - 0.0 * gamma, 0 * beta, 0 * gamma);
            else
                this.torso.setEulers(0.1 * alpha - 0.0 * gamma, 1 * beta, 1 * gamma);
            this.torso.setForces(accelX, accelY, accelZ);
            var sin = Math.sin(0 * alpha);
            var cos = Math.cos(0 * alpha);
            var tilt = Math.sin(gamma);
            var leftLeg = this.extremeties[Extremeties.LEG_LEFT];
            var leftArm = this.extremeties[Extremeties.ARM_LEFT];
            var rightArm = this.extremeties[Extremeties.ARM_RIGHT];
            if (twist)
                leftLeg.pullKnee(60, Math.sin(3 * gamma + 1.5), Math.cos(3 * gamma + 1.5));
            else
                leftLeg.stopTwist();
            leftArm.setArm(moveLA);
            rightArm.setArm(moveRA);
            if (!moveLA) {
                var height = 50 * tilt;
                leftArm.rotateSuspension(sin, cos, height);
            }
            if (!moveRA) {
                var height = 50 * tilt;
                rightArm.rotateSuspension(sin, cos, height);
            }
            //}
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
