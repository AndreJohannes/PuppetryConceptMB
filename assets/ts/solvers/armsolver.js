/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Solver;
(function (Solver) {
    var Arm = (function (_super) {
        __extends(Arm, _super);
        function Arm(offset) {
            _super.call(this, offset);
            this.armFixed = false;
        }
        Arm.prototype.reimposeConstraints = function (state) {
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
            // rNominal = this.nominalLength.string;
            // var r = Math.sqrt((x2 - x3) ** 2 + (y2 - y3) ** 2 + (z2 - z3) ** 2);
            // var delta_r = rNominal - r
            // x2 = x2 + delta_r / r * (x2 - x3);
            // y2 = y2 + delta_r / r * (y2 - y3);
            // z2 = z2 + delta_r / r * (z2 - z3);
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
        Arm.prototype.evaluate = function (state) {
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
            var x4 = this.rotatedAnchor.x;
            var y4 = this.rotatedAnchor.y;
            var z4 = this.rotatedAnchor.z;
            var x4dot = this.rotatedAnchor.xdot;
            var y4dot = this.rotatedAnchor.ydot;
            var z4dot = this.rotatedAnchor.zdot;
            var x4dotdot = this.rotatedAnchor.xdotdot;
            var y4dotdot = this.rotatedAnchor.ydotdot;
            var z4dotdot = this.rotatedAnchor.zdotdot;
            var gx = 0;
            var gy = -5 * y2dot;
            var gz = 30;
            gx = -5 * x2dot;
            gz = -5 * z2dot;
            var k = 0.0;
            var thread = [this.rotatedSuspension.x - x2, this.rotatedSuspension.y - y2, this.rotatedSuspension.z - z2];
            var length = MathUtils.len(thread);
            if (!this.armFixed) {
                var gx = gx - 20 * thread[0] * Math.min((this.nominalLength.string - length) / length, 0);
                var gy = gy - 20 * thread[1] * Math.min((this.nominalLength.string - length) / length, 0) - 50;
                var gz = gz - 20 * thread[2] * Math.min((this.nominalLength.string - length) / length, 0);
            }
            else {
                var gx = gx + 20 * (0 - x2);
                var gy = gy + 20 * (-10 - y2);
                var gz = gz + 20 * (60 - z2);
            }
            var fx = 0;
            var fy = -50;
            var fz = 0;
            var m11 = -2 * (Math.pow((z4 - z1), 2) + Math.pow((y4 - y1), 2) + Math.pow((x4 - x1), 2));
            var m12 = -2 * ((z2 - z1) * (z4 - z1) + (y2 - y1) * (y4 - y1) + (x2 - x1) * (x4 - x1));
            var m21 = m12;
            var m22 = -4 * (Math.pow((z2 - z1), 2) + Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
            var v11 = 2 * ((z4 - z1) * (z4dotdot - fz) + Math.pow((z4dot - z1dot), 2) + (y4 - y1) * (y4dotdot - fy) + Math.pow((y4dot - y1dot), 2) + (x4 - x1) * (x4dotdot - fx) + Math.pow((x4dot - x1dot), 2));
            var v12 = 2 * (Math.pow((z2dot - z1dot), 2) + (gz - fz) * (z2 - z1) + Math.pow((y2dot - y1dot), 2) + (gy - fy) * (y2 - y1) + Math.pow((x2dot - x1dot), 2) + (gx - fx) * (x2 - x1));
            var denominator = m12 * m21 - m11 * m22;
            var c1 = (m22 * v11 - m12 * v12) / denominator;
            var c2 = -(m21 * v11 - m11 * v12) / denominator;
            k = 1; // This is neccesary to keep time evolution stable
            return [x1dot,
                y1dot,
                z1dot,
                fx + c1 * (x4 - x1) + c2 * (x2 - x1) - k * x1dot,
                fy + c1 * (y4 - y1) + c2 * (y2 - y1) - k * y1dot,
                fz + c1 * (z4 - z1) + c2 * (z2 - z1) - k * z1dot,
                x2dot,
                y2dot,
                z2dot,
                gx + c2 * (x1 - x2) - k * x2dot,
                gy + c2 * (y1 - y2) - k * y2dot,
                gz + c2 * (z1 - z2) - k * z2dot
            ];
        };
        Arm.prototype.setArm = function (value) {
            this.armFixed = value;
        };
        Arm.prototype.length = function () {
            return 12;
        };
        return Arm;
    })(Solver.Extremity);
    Solver.Arm = Arm;
})(Solver || (Solver = {}));
