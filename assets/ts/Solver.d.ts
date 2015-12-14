/// <reference path="three.d.ts" />
/// <reference path="RungeKutta.d.ts" />
declare module Solver {
    class Solver {
        private functionObject;
        private rkSolver;
        private state;
        private time;
        solve(): void;
        setVolante(orientation: number[]): void;
        getState(): Array<number>;
    }
}
