/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />

module Solver {

    export class Arm extends Extremity {

        constructor(offset: number) {
            super(offset);
        }

        private reimposeConstraints(state: number[]) {

            var index = this.offset;
            var x1: number = state[index++];
            var y1: number = state[index++];
            var z1: number = state[index++]; index += 3;
            var x2: number = state[index++];
            var y2: number = state[index++];
            var z2: number = state[index++]; index += 3;
            var x3: number = state[index++];
            var y3: number = state[index++];
            var z3: number = state[index++];
            var x4: number = this.rotatedAnchor.x;
            var y4: number = this.rotatedAnchor.y;
            var z4: number = this.rotatedAnchor.z;

            var rNominal = this.nominalLength.upper;
            var r = Math.sqrt((x4 - x1) ** 2 + (y4 - y1) ** 2 + (z4 - z1) ** 2);
            var delta_r = rNominal - r
            x1 = x1 + delta_r / r * (x1 - x4);
            y1 = y1 + delta_r / r * (y1 - y4);
            z1 = z1 + delta_r / r * (z1 - z4);
            rNominal = this.nominalLength.lower;
            var r = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
            var delta_r = rNominal - r
            x2 = x2 + delta_r / r * (x2 - x1);
            y2 = y2 + delta_r / r * (y2 - y1);
            z2 = z2 + delta_r / r * (z2 - z1);
            rNominal = this.nominalLength.string;
            var r = Math.sqrt((x2 - x3) ** 2 + (y2 - y3) ** 2 + (z2 - z3) ** 2);
            var delta_r = rNominal - r
            x2 = x2 + delta_r / r * (x2 - x3);
            y2 = y2 + delta_r / r * (y2 - y3);
            z2 = z2 + delta_r / r * (z2 - z3);

            index = this.offset;
            state[index++] = x1;
            state[index++] = y1;
            state[index++] = z1; index += 3;
            state[index++] = x2;
            state[index++] = y2;
            state[index++] = z2; index += 3;
            state[index++] = x3;
            state[index++] = y3;
            state[index++] = z3;
        }

        evaluate(state: number[]): number[] {

            this.reimposeConstraints(state);

            var index = this.offset;
            var x1: number = state[index++];
            var y1: number = state[index++];
            var z1: number = state[index++];
            var x1dot: number = state[index++];
            var y1dot: number = state[index++];
            var z1dot: number = state[index++];
            var x2: number = state[index++];
            var y2: number = state[index++];
            var z2: number = state[index++];
            var x2dot: number = state[index++];
            var y2dot: number = state[index++];
            var z2dot: number = state[index++];
            var x3: number = state[index++];
            var y3: number = state[index++];
            var z3: number = state[index++];
            var x3dot: number = state[index++];
            var y3dot: number = state[index++];
            var z3dot: number = state[index++];
            var x4: number = this.rotatedAnchor.x;
            var y4: number = this.rotatedAnchor.y;
            var z4: number = this.rotatedAnchor.z;
            var x4dot: number = this.rotatedAnchor.xdot;
            var y4dot: number = this.rotatedAnchor.ydot;
            var z4dot: number = this.rotatedAnchor.zdot;
            var x4dotdot: number = this.rotatedAnchor.xdotdot;
            var y4dotdot: number = this.rotatedAnchor.ydotdot;
            var z4dotdot: number = this.rotatedAnchor.zdotdot;

            var g: number = -50;
            var k: number = 0.0;

            var fx = 100 * (this.rotatedSuspension.x - x3) - 20 * x3dot;
            var fy = 100 * (this.rotatedSuspension.y - y3) - 20 * y3dot;
            var fz = 100 * (this.rotatedSuspension.z - z3) - 20 * z3dot;

            var m11 = -2 * ((x1 - x4) ** 2 + (y1 - y4) ** 2 + (z1 - z4) ** 2);
            var m12 = -2 * ((x1 - x2) * (x1 - x4) + (y1 - y2) * (y1 - y4) + (z1 - z2) * (z1 - z4));
            var m13 = 0;
            var m21 = 2 * (-((x1 - x2) * (x1 - x4)) - (y1 - y2) * (y1 - y4) - (z1 - z2) * (z1 - z4));
            var m22 = -4 * ((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
            var m23 = -2 * (-((x1 - x2) * (x2 - x3)) - (y1 - y2) * (y2 - y3) - (z1 - z2) * (z2 - z3));
            var m31 = 0;
            var m32 = -2 * (-((x1 - x2) * (x2 - x3)) - (y1 - y2) * (y2 - y3) - (z1 - z2) * (z2 - z3));
            var m33 = -2 * ((x2 - x3) ** 2 + (y2 - y3) ** 2 + (z2 - z3) ** 2);
            var v11 = -2 * (x1dot - x4dot) ** 2 + 2 * (x1 - x4) * (k * x1dot + x4dotdot) - 2 * (y1dot - y4dot) ** 2 - 2 * (y1 - y4) * (g - k * y1dot - y4dotdot) - 2 * (z1dot - z4dot) ** 2 + 2 * (z1 - z4) * (k * z1dot + z4dotdot);
            var v12 = 2 * (k * (x1 - x2) * (x1dot - x2dot) - (x1dot - x2dot) ** 2 + k * (y1 - y2) * (y1dot - y2dot) - (y1dot - y2dot) ** 2 + k * (z1 - z2) * (z1dot - z2dot) - (z1dot - z2dot) ** 2);
            var v13 = -2 * (x2dot - x3dot) ** 2 - 2 * (x2 - x3) * (- fx - k * x2dot + k * x3dot) - 2 * (y2dot - y3dot) ** 2 - 2 * (y2 - y3) * (- fy + g - k * y2dot + k * y3dot) - 2 * (z2dot - z3dot) ** 2 - 2 * (z2 - z3) * (- fz - k * z2dot + k * z3dot);

            var denominator = m13 * m22 * m31 - m12 * m23 * m31
                - m13 * m21 * m32 + m11 * m23 * m32
                + m12 * m21 * m33 - m11 * m22 * m33;

            var c1 = ((m23 * m32 - m22 * m33) * v11 + (m12 * m33 - m13 * m32) * v12 + (m13 * m22 - m12 * m23) * v13) / denominator;
            var c2 = ((m21 * m33 - m23 * m31) * v11 + (m13 * m31 - m11 * m33) * v12 + (m11 * m23 - m13 * m21) * v13) / denominator;
            var c3 = ((m22 * m31 - m21 * m32) * v11 + (m11 * m32 - m12 * m31) * v12 + (m12 * m21 - m11 * m22) * v13) / denominator;

            k = 5; // This is neccesary to keep time evolution stable!! (introducing viscosity)

            return [x1dot,
                y1dot,
                z1dot,
                c1 * (x4 - x1) + c2 * (x2 - x1) - k * x1dot,
                g + c1 * (y4 - y1) + c2 * (y2 - y1) - k * y1dot,
                c1 * (z4 - z1) + c2 * (z2 - z1) - k * z1dot,
                x2dot,
                y2dot,
                z2dot,
                c2 * (x1 - x2) + c3 * (x3 - x2) - k * x2dot,
                g + c2 * (y1 - y2) + c3 * (y3 - y2) - k * y2dot,
                c2 * (z1 - z2) + c3 * (z3 - z2) - k * z2dot,
                x3dot,
                y3dot,
                z3dot,
                fx - k * x3dot,
                fy - k * y3dot,
                fz - k * z3dot];
        }
        
        public length(): number {
            return 18;
        }

    }

}