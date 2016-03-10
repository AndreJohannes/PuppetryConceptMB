/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />

module Solver {

    export class Arm extends Extremity {

        constructor(offset: number) {
            super(offset);
        }

        private armFixed: boolean = false;

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
            var delta_r = rNominal - r;
            x1 = x1 + delta_r / r * (x1 - x4);
            y1 = y1 + delta_r / r * (y1 - y4);
            z1 = z1 + delta_r / r * (z1 - z4);
            rNominal = this.nominalLength.lower;
            var r = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
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
            state[index++] = z1; index += 3;
            state[index++] = x2;
            state[index++] = y2;
            state[index++] = z2; index += 3;
            state[index++] = x3;
            state[index++] = y3;
            state[index++] = z3;
        }


        public evaluate(state: number[]): number[] {

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
            var x4: number = this.rotatedAnchor.x;
            var y4: number = this.rotatedAnchor.y;
            var z4: number = this.rotatedAnchor.z;
            var x4dot: number = this.rotatedAnchor.xdot;
            var y4dot: number = this.rotatedAnchor.ydot;
            var z4dot: number = this.rotatedAnchor.zdot;
            var x4dotdot: number = this.rotatedAnchor.xdotdot;
            var y4dotdot: number = this.rotatedAnchor.ydotdot;
            var z4dotdot: number = this.rotatedAnchor.zdotdot;


            var gx = 0; var gy = -5 * y2dot; var gz = 30;
            gx = -5 * x2dot; gz = -5 * z2dot;
            var k: number = 0.0;

            var thread: number[] = [this.rotatedSuspension.x - x2, this.rotatedSuspension.y - y2, this.rotatedSuspension.z - z2];
            var length: number = MathUtils.len(thread);
            if (!this.armFixed) {
                var gx = gx - 20 * thread[0] * Math.min((this.nominalLength.string - length) / length, 0);
                var gy = gy - 20 * thread[1] * Math.min((this.nominalLength.string - length) / length, 0) - 50;
                var gz = gz - 20 * thread[2] * Math.min((this.nominalLength.string - length) / length, 0);
            } else {
                var gx = gx + 20 * (0 - x2);
                var gy = gy + 20 * (-10 - y2);
                var gz = gz + 20 * (60 - z2);
            }
            var fx = 0;
            var fy = -50;
            var fz = 0;

            var m11 = -2 * ((z4 - z1) ** 2 + (y4 - y1) ** 2 + (x4 - x1) ** 2);
            var m12 = -2 * ((z2 - z1) * (z4 - z1) + (y2 - y1) * (y4 - y1) + (x2 - x1) * (x4 - x1));
            var m21 = m12;
            var m22 = -4 * ((z2 - z1) ** 2 + (y2 - y1) ** 2 + (x2 - x1) ** 2);
            var v11 = 2 * ((z4 - z1) * (z4dotdot - fz) + (z4dot - z1dot) ** 2 + (y4 - y1) * (y4dotdot - fy) + (y4dot - y1dot) ** 2 + (x4 - x1) * (x4dotdot - fx) + (x4dot - x1dot) ** 2);
            var v12 = 2 * ((z2dot - z1dot) ** 2 + (gz - fz) * (z2 - z1) + (y2dot - y1dot) ** 2 + (gy - fy) * (y2 - y1) + (x2dot - x1dot) ** 2 + (gx - fx) * (x2 - x1));

            var denominator = m12 * m21 - m11 * m22;

            var c1 = (m22 * v11 - m12 * v12) / denominator;
            var c2 = -(m21 * v11 - m11 * v12) / denominator;
            k = 1;// This is neccesary to keep time evolution stable

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
        }

        public setArm(value: boolean){
            this.armFixed = value;    
        }

        public length(): number {
            return 12;
        }

    }

}