module RungeKutta {

    export interface Function {

        evaluate(state: number[]): number[];

    }

    export interface Solver {
        solve(state: number[], stepSize: number): number[];
    }

    export class RungeKuttaSolver4th implements Solver {

        private function: Function;

        constructor(funct: Function) {
            this.function = funct;
        }

        public solve(state: number[], stepSize: number): number[] {
            var k1: number[] = this.function.evaluate(state);
            var k2: number[] = this.function.evaluate(this.add(state, this.scale(k1, stepSize / 2.0)));
            var k3: number[] = this.function.evaluate(this.add(state, this.scale(k2, stepSize / 2.0)));
            var k4: number[] = this.function.evaluate(this.add(state, this.scale(k3, stepSize)));

            return this.add(state,this.scale(this.add(this.scale(this.add(k2, k3), 2.0), this.add(k1, k4)), stepSize / 6.0));
        }

        private add(a: number[], b: number[]): number[] {
            var retArray: number[] = [];
            for (var i = 0; i < a.length; i++) {
                retArray.push(a[i] + b[i]);
            }
            return retArray;
        }

        private scale(a: number[], factor: number): number[] {
            var retArray: number[] = [];
            for (var i = 0; i < a.length; i++) {
                retArray.push(a[i] * factor);
            }
            return retArray;
        }
    }

}