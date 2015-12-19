/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />
var Solver;
(function (Solver) {
    var Extremity = (function () {
        function Extremity(offset) {
            this.initialAnchor = { "x": 0, "y": 0, "z": 0 };
            this.rotatedAnchor = { "x": 0, "y": 0, "z": 0, "xdot": 0, "ydot": 0, "zdot": 0, "xdotdot": 0, "ydotdot": 0, "zdotdot": 0 };
            this.initialSuspension = { "x": 0, "y": 0, "z": 0 };
            this.rotatedSuspension = { "x": 0, "y": 0, "z": 0 };
            this.nominalLength = { "upper": 0, "lower": 0, "string": 0 };
            this.offset = offset;
        }
        Extremity.prototype.setInitialAnchor = function (value) {
            this.initialAnchor.x = value[0];
            this.initialAnchor.y = value[1];
            this.initialAnchor.z = value[2];
            this.rotatedAnchor.x = value[0];
            this.rotatedAnchor.y = value[1];
            this.rotatedAnchor.z = value[2];
        };
        Extremity.prototype.getRotatedAnchor = function () {
            return (new THREE.Vector3(this.rotatedAnchor.x, this.rotatedAnchor.y, this.rotatedAnchor.z));
        };
        Extremity.prototype.rotateAnchor = function (theta, thetaDot, thetaDotDot) {
            var sin = Math.sin(theta);
            var cos = Math.cos(theta);
            var x = this.initialAnchor.x * cos + this.initialAnchor.z * sin;
            var y = this.initialAnchor.y;
            var z = -this.initialAnchor.x * sin + this.initialAnchor.z * cos;
            ;
            var xdot = thetaDot * (-this.initialAnchor.x * sin + this.initialAnchor.z * cos);
            var zdot = thetaDot * (-this.initialAnchor.x * cos - this.initialAnchor.z * sin);
            var xdotdot = -x * thetaDot * thetaDot + thetaDotDot * xdot;
            var zdotdot = -z * thetaDot * thetaDot + thetaDotDot * zdot;
            this.rotatedAnchor.x = x;
            this.rotatedAnchor.y = y;
            this.rotatedAnchor.z = z;
            this.rotatedAnchor.xdot = xdot;
            this.rotatedAnchor.ydot = 0;
            this.rotatedAnchor.zdot = zdot;
            this.rotatedAnchor.xdotdot = xdotdot;
            this.rotatedAnchor.ydotdot = 0;
            this.rotatedAnchor.zdotdot = zdotdot;
        };
        Extremity.prototype.setInitialSuspension = function (value) {
            this.initialSuspension.x = value[0];
            this.initialSuspension.y = value[1];
            this.initialSuspension.z = value[2];
            this.rotatedSuspension.x = value[0];
            this.rotatedSuspension.y = value[1];
            this.rotatedSuspension.z = value[2];
        };
        Extremity.prototype.rotateSuspension = function (sin, cos, height) {
            var x = this.initialSuspension.x;
            var y = this.initialSuspension.y;
            var z = this.initialSuspension.z;
            this.rotatedSuspension.x = x * cos + z * sin;
            this.rotatedSuspension.y = y + height;
            this.rotatedSuspension.z = z * cos - x * sin;
        };
        Extremity.prototype.setNominals = function (values) {
            this.nominalLength.upper = values[0];
            this.nominalLength.lower = values[1];
            this.nominalLength.string = values[2];
        };
        return Extremity;
    })();
    Solver.Extremity = Extremity;
})(Solver || (Solver = {}));
