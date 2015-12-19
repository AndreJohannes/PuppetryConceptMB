/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Solver;
(function (Solver) {
    var Leg = (function (_super) {
        __extends(Leg, _super);
        function Leg(offset) {
            _super.call(this, offset);
        }
        Leg.prototype.reimposeConstraints = function (state) {
            var index = this.offset;
            var x1 = state[index++];
            var y1 = state[index++];
            var z1 = state[index++];
            index += 3;
            var x2 = state[index++];
            var y2 = state[index++];
            var z2 = state[index++];
            index += 3;
            var x3 = state[index++];
            var y3 = state[index++];
            var z3 = state[index++];
            var x4 = this.rotatedAnchor.x;
            var y4 = this.rotatedAnchor.y;
            var z4 = this.rotatedAnchor.z;
            var rNominal = this.nominalLength.upper;
            var r = Math.sqrt(Math.pow((x4 - x1), 2) + Math.pow((y4 - y1), 2) + Math.pow((z4 - z1), 2));
            var delta_r = rNominal - r;
            x1 = x1 + delta_r / r * (x1 - x4);
            y1 = y1 + delta_r / r * (y1 - y4);
            z1 = z1 + delta_r / r * (z1 - z4);
            rNominal = this.nominalLength.lower;
            var r = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2) + Math.pow((z2 - z1), 2));
            var delta_r = rNominal - r;
            x2 = x2 + delta_r / r * (x2 - x1);
            y2 = y2 + delta_r / r * (y2 - y1);
            z2 = z2 + delta_r / r * (z2 - z1);
            rNominal = this.nominalLength.string;
            var r = Math.sqrt(Math.pow((x1 - x3), 2) + Math.pow((y1 - y3), 2) + Math.pow((z1 - z3), 2));
            var delta_r = rNominal - r;
            x1 = x1 + delta_r / r * (x1 - x3);
            y1 = y1 + delta_r / r * (y1 - y3);
            z1 = z1 + delta_r / r * (z1 - z3);
            index = this.offset;
            state[index++] = x1;
            state[index++] = y1;
            state[index++] = z1;
            index += 3;
            state[index++] = x2;
            state[index++] = y2;
            state[index++] = z2;
            index += 3;
            state[index++] = x3;
            state[index++] = y3;
            state[index++] = z3;
        };
        Leg.prototype.evaluate = function (state) {
            this.reimposeConstraints(state);
            var index = this.offset;
            var x1 = state[index++];
            var y1 = state[index++];
            var z1 = state[index++];
            var x1dot = state[index++];
            var y1dot = state[index++];
            var z1dot = state[index++];
            var x2 = state[index++];
            var y2 = state[index++];
            var z2 = state[index++];
            var x2dot = state[index++];
            var y2dot = state[index++];
            var z2dot = state[index++];
            var x3 = state[index++];
            var y3 = state[index++];
            var z3 = state[index++];
            var x3dot = state[index++];
            var y3dot = state[index++];
            var z3dot = state[index++];
            var x4 = this.rotatedAnchor.x;
            var y4 = this.rotatedAnchor.y;
            var z4 = this.rotatedAnchor.z;
            var x4dot = this.rotatedAnchor.xdot;
            var y4dot = this.rotatedAnchor.ydot;
            var z4dot = this.rotatedAnchor.zdot;
            var x4dotdot = this.rotatedAnchor.xdotdot;
            var y4dotdot = this.rotatedAnchor.ydotdot;
            var z4dotdot = this.rotatedAnchor.zdotdot;
            var g = -50;
            var k = 0.0;
            var fx = 100 * (this.rotatedSuspension.x - x3) - 20 * x3dot;
            var fy = 100 * (this.rotatedSuspension.y - y3) - 20 * y3dot;
            var fz = 100 * (this.rotatedSuspension.z - z3) - 20 * z3dot;
            var m11 = -2 * (Math.pow((x1 - x4), 2) + Math.pow((y1 - y4), 2) + Math.pow((z1 - z4), 2));
            var m12 = -2 * ((x1 - x2) * (x1 - x4) + (y1 - y2) * (y1 - y4) + (z1 - z2) * (z1 - z4));
            var m13 = -2 * ((x1 - x3) * (x1 - x4) + (y1 - y3) * (y1 - y4) + (z1 - z3) * (z1 - z4));
            var m21 = 2 * (-((x1 - x2) * (x1 - x4)) - (y1 - y2) * (y1 - y4) - (z1 - z2) * (z1 - z4));
            var m22 = -4 * (Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2) + Math.pow((z1 - z2), 2));
            var m23 = 2 * (-((x1 - x2) * (x1 - x3)) - (y1 - y2) * (y1 - y3) - (z1 - z2) * (z1 - z3));
            var m31 = -2 * ((x1 - x3) * (x1 - x4) + (y1 - y3) * (y1 - y4) + (z1 - z3) * (z1 - z4));
            var m32 = -2 * ((x1 - x2) * (x1 - x3) + (y1 - y2) * (y1 - y3) + (z1 - z2) * (z1 - z3));
            var m33 = -2 * (Math.pow((x1 - x3), 2) + Math.pow((y1 - y3), 2) + Math.pow((z1 - z3), 2));
            var v11 = -2 * Math.pow((x1dot - x4dot), 2) + 2 * (x1 - x4) * (k * x1dot + x4dotdot) - 2 * Math.pow((y1dot - y4dot), 2) - 2 * (y1 - y4) * (g - k * y1dot - y4dotdot) - 2 * Math.pow((z1dot - z4dot), 2) + 2 * (z1 - z4) * (k * z1dot + z4dotdot);
            var v12 = 2 * (k * (x1 - x2) * (x1dot - x2dot) - Math.pow((x1dot - x2dot), 2) + k * (y1 - y2) * (y1dot - y2dot) - Math.pow((y1dot - y2dot), 2) + k * (z1 - z2) * (z1dot - z2dot) - Math.pow((z1dot - z2dot), 2));
            var v13 = -2 * Math.pow((x1dot - x3dot), 2) - 2 * (x1 - x3) * (0. - fx - k * x1dot + k * x3dot) - 2 * Math.pow((y1dot - y3dot), 2) - 2 * (y1 - y3) * (0. - fy + g - k * y1dot + k * y3dot) - 2 * Math.pow((z1dot - z3dot), 2) - 2 * (z1 - z3) * (0. - fz - k * z1dot + k * z3dot);
            var denominator = m13 * m22 * m31 - m12 * m23 * m31
                - m13 * m21 * m32 + m11 * m23 * m32
                + m12 * m21 * m33 - m11 * m22 * m33;
            var c1 = (m23 * m32 - m22 * m33) * v11 / denominator + (m12 * m33 - m13 * m32) * v12 / denominator + (m13 * m22 - m12 * m23) * v13 / denominator;
            var c2 = (m21 * m33 - m23 * m31) * v11 / denominator + (m13 * m31 - m11 * m33) * v12 / denominator + (m11 * m23 - m13 * m21) * v13 / denominator;
            var c3 = (m22 * m31 - m21 * m32) * v11 / denominator + (m11 * m32 - m12 * m31) * v12 / denominator + (m12 * m21 - m11 * m22) * v13 / denominator;
            k = 5; // This is neccesary to keep time evolution stable
            return [x1dot,
                y1dot,
                z1dot,
                c1 * (x4 - x1) + c2 * (x2 - x1) + c3 * (x3 - x1) - k * x1dot,
                g + c1 * (y4 - y1) + c2 * (y2 - y1) + c3 * (y3 - y1) - k * y1dot,
                c1 * (z4 - z1) + c2 * (z2 - z1) + c3 * (z3 - z1) - k * z1dot,
                x2dot,
                y2dot,
                z2dot,
                c2 * (x1 - x2) - k * x2dot,
                g + c2 * (y1 - y2) - k * y2dot,
                c2 * (z1 - z2) - k * z2dot,
                x3dot,
                y3dot,
                z3dot,
                fx - k * x3dot,
                fy - k * y3dot,
                fz - k * z3dot];
        };
        return Leg;
    })(Solver.Extremity);
    Solver.Leg = Leg;
})(Solver || (Solver = {}));
