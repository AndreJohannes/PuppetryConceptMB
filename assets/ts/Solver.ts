/// <reference path="three.d.ts" />
/// <reference path="RungeKutta.ts" />

module Solver {

    class Torsion implements RungeKutta.Function {

        private alpha: number = 0;

        evaluate(state: number[]): number[] {
            var theta = state[0];
            var thetadot = state[1];
            var k = 1;
            var d = 0.1;

            var thetadotdot = k * this.mod(this.alpha - theta) - d * thetadot;

            return [thetadot, thetadotdot];
        }

        public setAlpha(value: number) {
            this.alpha = value
        }

        private mod(value: number): number {
            var ret = value % (2 * Math.PI);
            if (ret > Math.PI)
                return ret - 2 * Math.PI;
            if(ret>(-Math.PI))
                return ret + 2 * Math.PI;
            return ret;
        }

    }

    class Function implements RungeKutta.Function {

        private fpX: number = -5;
        private fpY: number = 5;
        private fpZ: number = 0;

        evaluate(state: number[]): number[] {

            var x1: number = state[0];
            var y1: number = state[1];
            var z1: number = state[2];
            var x1dot: number = state[3];
            var y1dot: number = state[4];
            var z1dot: number = state[5];
            var x2: number = state[6];
            var y2: number = state[7];
            var z2: number = state[8];
            var x2dot: number = state[9];
            var y2dot: number = state[10];
            var z2dot: number = state[11];
            var x3: number = state[12];
            var y3: number = state[13];
            var z3: number = state[14];
            var x3dot: number = state[15];
            var y3dot: number = state[16];
            var z3dot: number = state[17];

            var g: number = -1;
            var k: number = 0.05;

            var fx = 100 * (this.fpX - x3) - 10 * x3dot;
            var fy = 100 * (this.fpY - y3) - 10 * y3dot;
            var fz = 100 * (this.fpZ - z3) - 10 * z3dot;

            var m11 = -2 * (x1 ** 2 + y1 ** 2 + z1 ** 2);
            var m12 = -2 * (x1 ** 2 - x1 * x2 + y1 ** 2 - y1 * y2 + z1 * (z1 - z2));
            var m13 = 0;
            var m21 = 2 * (x1 * (-x1 + x2) + y1 * (-y1 + y2) + z1 * (-z1 + z2));
            var m22 = -4 * ((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
            var m23 = -2 * (-((x1 - x2) * (x2 - x3)) - (y1 - y2) * (y2 - y3) - (z1 - z2) * (z2 - z3));
            var m31 = 0;
            var m32 = -2 * (-((x1 - x2) * (x2 - x3)) - (y1 - y2) * (y2 - y3) - (z1 - z2) * (z2 - z3));
            var m33 = -2 * ((x2 - x3) ** 2 + (y2 - y3) ** 2 + (z2 - z3) ** 2);
            var v11 = -2 * (-(k * x1 * x1dot) + x1dot ** 2 + y1dot ** 2 + y1 * (g - k * y1dot) - k * z1 * z1dot + z1dot ** 2);
            var v12 = 2 * (k * (x1 - x2) * (x1dot - x2dot) - (x1dot - x2dot) ** 2 + k * (y1 - y2) * (y1dot - y2dot) - (y1dot - y2dot) ** 2 + k * (z1 - z2) * (z1dot - z2dot) - (z1dot - z2dot) ** 2);
            var v13 = -2 * (x2dot - x3dot) ** 2 - 2 * (x2 - x3) * (0. - fx - k * x2dot + k * x3dot) - 2 * (y2dot - y3dot) ** 2 -
                2 * (y2 - y3) * (0. - fy + g - k * y2dot + k * y3dot) - 2 * (z2dot - z3dot) ** 2 - 2 * (z2 - z3) * (0. - fz - k * z2dot + k * z3dot);
            //var v13 = -2 * (x1dot - x3dot) ** 2 - 2 * (x1 - x3) * (0. - fx - k * x1dot + k * x3dot) - 2 * (y1dot - y3dot) ** 2 -
            //    2 * (y1 - y3) * (0. - fy + g - k * y1dot + k * y3dot) - 2 * (z1dot - z3dot) ** 2 - 2 * (z1 - z3) * (0. - fz - k * z1dot + k * z3dot);

            var denominator = m13 * m22 * m31 - m12 * m23 * m31
                - m13 * m21 * m32 + m11 * m23 * m32
                + m12 * m21 * m33 - m11 * m22 * m33;

            var c1 = (m23 * m32 - m22 * m33) * v11 / denominator + (m12 * m33 - m13 * m32) * v12 / denominator + (m13 * m22 - m12 * m23) * v13 / denominator;
            var c2 = (m21 * m33 - m23 * m31) * v11 / denominator + (m13 * m31 - m11 * m33) * v12 / denominator + (m11 * m23 - m13 * m21) * v13 / denominator;
            var c3 = (m22 * m31 - m21 * m32) * v11 / denominator + (m11 * m32 - m12 * m31) * v12 / denominator + (m12 * m21 - m11 * m22) * v13 / denominator;


            return [x1dot,
                y1dot,
                z1dot,
                - c1 * x1 + c2 * (x2 - x1) + 0 * c3 * (x3 - x1) - k * x1dot,
                g - c1 * y1 + c2 * (y2 - y1) + 0 * c3 * (y3 - y1) - k * y1dot,
                - c1 * z1 + c2 * (z2 - z1) + 0 * c3 * (z3 - z1) - k * z1dot,
                x2dot,
                y2dot,
                z2dot,
                c2 * (x1 - x2) + c3 * (x3 - x2) - k * x2dot,
                g + c2 * (y1 - y2) + c3 * (y3 - y2) - k * y2dot,
                c2 * (z1 - z2) + c3 * (z3 - z2) - k * z2dot,
                x3dot,
                y3dot,
                z3dot,
                fx + 0.0 * c3 * (x1 - x3) - k * x3dot,
                fy + 0.0 * c3 * (y1 - y3) - k * y3dot,
                fz + 0.0 * c3 * (z1 - z3) - k * z3dot]
        };

        set fixPoint(point: number[]) {
            this.fpX = point[0];
            this.fpY = point[1];
            this.fpZ = point[2];
        }

    }

    export class Solver {

        private functionObject: Torsion = new Torsion();
        private rkSolver: RungeKutta.Solver = new RungeKutta.RungeKuttaSolver4th(this.functionObject);
        private state: Array<number> = [0, 0];//7[-5, -1, 0, 0, 0, 0, -10, 0, 0, 0, 0, 0, -10, 5, 0, 0, 0, 0];
        private time: number = 0;

        public solve() {
            //console.log(this.state);
            // this.functionObject.fixPoint = [-10 + 0 * Math.cos(0.3 * this.time), 5, Math.sin(0.3 * this.time)];
            this.state = this.rkSolver.solve(this.state, 0.05);
            //this.state = [this.time / 10];
            this.time += 0.05;
        }

        public setVolante(orientation: number[]) {
            this.functionObject.setAlpha(-orientation[0]);
        }

        public getState(): Array<number> {
            return this.state;
        }

    }
}