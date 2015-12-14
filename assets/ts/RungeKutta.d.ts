declare module RungeKutta {
    interface Function {
        evaluate(state: number[]): number[];
    }
    interface Solver {
        solve(state: number[], stepSize: number): number[];
    }
    class RungeKuttaSolver4th implements Solver {
        private function;
        constructor(funct: Function);
        solve(state: number[], stepSize: number): number[];
        private add(a, b);
        private scale(a, factor);
    }
}
