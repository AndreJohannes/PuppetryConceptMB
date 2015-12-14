/// <reference path="jquery.d.ts" />
/// <reference path="three.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="Solver.d.ts" />
/// <reference path="Objects.d.ts" />
declare class Render {
    private camera;
    private scene;
    private renderer;
    private controls;
    private solver;
    private cylinders;
    private spheres;
    private body;
    private volante;
    private stats;
    constructor();
    private addStats(dom);
    animate(): void;
    private static _animate(render);
    private render();
    private createObjectsFromJson();
}
