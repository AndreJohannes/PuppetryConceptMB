/// <reference path="three.d.ts" />
/// <reference path="rungekutta.ts" />
/// <reference path="./solvers/bodysolver.ts" />

module Solver {

    export enum Commands {
        JawOpen = 1,
        JawClose = 2,
        LeftLegTwist = 3,
        RightLegTwist = 4,
        PlayAudio = 5,
        StopAudio = 6,
        RoleEyes = 7,
        StopEyes = 8
    }

    export enum Mode {
        None,
        LeftTwist
    }

    class FallbackModel {

        body = {
            "head": [0, 87, 0],
            "coxis": [0, 0, 0],
            "neck": [0, 60, 0],
            "left_shoulder": [25, 60, 0],
            "right_shoulder": [-25, 60, 0],
            "left_pelvis": [15, 0, 0],
            "right_pelvis": [-15, 0, 0]
        }
        left_arm = {
            "elbow": [25, 20, 5],
            "wrist": [25, 20, 45],
            "suspension": [25, 120, 60]
        }
        right_arm = {
            "elbow": [-25, 20, 5],
            "wrist": [-25, 20, 45],
            "suspension": [-25, 120, 60]
        }
        left_leg = {
            "knee": [15, -45, 0],
            "ankle": [15, -90, 0],
            "suspension": [15, 120, 45]
        }
        right_leg = {
            "knee": [-15, -45, 0],
            "ankle": [-15, -90, 0],
            "suspension": [-15, 120, 45]
        }

    }

    class BonesAndJoints {

        public spine: Objects.Cylinder;
        public collar: Objects.Cylinder;
        public pelvis: Objects.Cylinder;

        public left_upper_arm: Objects.Cylinder;
        public left_lower_arm: Objects.Cylinder;
        public right_upper_arm: Objects.Cylinder;
        public right_lower_arm: Objects.Cylinder;

        public left_thigh: Objects.Cylinder;
        public right_thigh: Objects.Cylinder;
        public left_shin: Objects.Cylinder;
        public right_shin: Objects.Cylinder;

        public left_eye: Objects.Sphere;
        public right_eye: Objects.Sphere;

        public head: Objects.Sphere;
        public coxis: Objects.Sphere;
        public neck: Objects.Sphere;
        public left_shoulder: Objects.Sphere;
        public right_shoulder: Objects.Sphere;
        public left_hip: Objects.Sphere;
        public right_hip: Objects.Sphere;

        public left_elbow: Objects.Sphere;
        public right_elbow: Objects.Sphere;
        public left_wrist: Objects.Sphere;
        public right_wrist: Objects.Sphere;

        public left_knee: Objects.Sphere;
        public right_knee: Objects.Sphere;
        public left_ankle: Objects.Sphere;
        public right_ankle: Objects.Sphere;

    }

    export class Solver {

        private body: Body = new Body();
        private torso: THREE.Object3D;
        private head: THREE.Object3D;
        private jaw: THREE.Object3D;
        private rkSolver: RungeKutta.Solver = new RungeKutta.RungeKuttaSolver4th(this.body);
        private state: Array<number>;
        private bonesAndJoint: BonesAndJoints;
        private time: number = 0;

        constructor(scene: THREE.Object3D) {
            this.addModel(scene, new FallbackModel());
        }

        private dt = .01;
        public solve() {
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);
            this.state = this.rkSolver.solve(this.state, 0.01);

            this.torso.rotation.x = this.state[2];
            this.torso.rotation.y = this.state[0];
            this.torso.position.y = this.state[4];
            this.torso.position.x = this.state[6];
            this.torso.position.z = this.state[8];

            this.head.position.y = 87 + this.state[10];
            this.head.rotation.x = this.state[2];
            this.head.rotation.y = this.state[12];
            this.head.rotation.z = this.state[14];
            this.bonesAndJoint.left_eye.centerPoint = this.body.head.locLeftEye;
            this.bonesAndJoint.right_eye.centerPoint = this.body.head.locRightEye;

            var offset = 16;
            this.bonesAndJoint.right_elbow.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.right_wrist.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            var arm: Extremity = this.body.extremeties[Extremeties.ARM_RIGHT.toString()];
            this.bonesAndJoint.right_upper_arm.startPoint = arm.getRotatedAnchor();
            this.bonesAndJoint.right_upper_arm.endPoint = this.bonesAndJoint.right_elbow.centerPoint;
            this.bonesAndJoint.right_lower_arm.startPoint = this.bonesAndJoint.right_elbow.centerPoint;
            this.bonesAndJoint.right_lower_arm.endPoint = this.bonesAndJoint.right_wrist.centerPoint;

            offset = offset + 18;
            this.bonesAndJoint.left_elbow.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.left_wrist.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            var arm: Extremity = this.body.extremeties[Extremeties.ARM_LEFT.toString()];
            this.bonesAndJoint.left_upper_arm.startPoint = arm.getRotatedAnchor();
            this.bonesAndJoint.left_upper_arm.endPoint = this.bonesAndJoint.left_elbow.centerPoint;
            this.bonesAndJoint.left_lower_arm.startPoint = this.bonesAndJoint.left_elbow.centerPoint;
            this.bonesAndJoint.left_lower_arm.endPoint = this.bonesAndJoint.left_wrist.centerPoint;

            offset = offset + 18;
            this.bonesAndJoint.right_knee.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.right_ankle.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            this.bonesAndJoint.right_thigh.startPoint = this.body.extremeties[Extremeties.LEG_RIGHT.toString()].getRotatedAnchor();
            this.bonesAndJoint.right_thigh.endPoint = this.bonesAndJoint.right_knee.centerPoint;
            this.bonesAndJoint.right_shin.startPoint = this.bonesAndJoint.right_knee.centerPoint;
            this.bonesAndJoint.right_shin.endPoint = this.bonesAndJoint.right_ankle.centerPoint;

            offset = offset + 18;
            this.bonesAndJoint.left_knee.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.left_ankle.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            this.bonesAndJoint.left_thigh.startPoint = this.body.extremeties[Extremeties.LEG_LEFT.toString()].getRotatedAnchor();
            this.bonesAndJoint.left_thigh.endPoint = this.bonesAndJoint.left_knee.centerPoint;
            this.bonesAndJoint.left_shin.startPoint = this.bonesAndJoint.left_knee.centerPoint;
            this.bonesAndJoint.left_shin.endPoint = this.bonesAndJoint.left_ankle.centerPoint;

            this.time += this.dt;
            
        }

        public setVolante(orientation: number[], accelerations: number[], mode: Mode) {
            this.body.setEulersAndAccelerations(-orientation[0], -orientation[1],
                -orientation[2], accelerations[0], accelerations[1], orientation[3], mode);
        }

        public openJaw() {
            this.jaw.position.y = -1;
        }

        public closeJaw() {
            this.jaw.position.y = 2;
        }

        public getState(): Array<number> {
            return this.state;
        }

        public roleEyes(start: boolean = true) {
            if (start == true)
                this.body.head.rollEyes();
            else
                this.body.head.stopEyes();
        }

        private addModel(scene: THREE.Object3D, model: FallbackModel) {

            var threeZeros = [0, 0, 0];
            this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.state = this.state.concat(model.right_arm.elbow).concat(threeZeros).concat(model.right_arm.wrist).concat(threeZeros).concat(model.right_arm.suspension).concat(threeZeros);
            this.state = this.state.concat(model.left_arm.elbow).concat(threeZeros).concat(model.left_arm.wrist).concat(threeZeros).concat(model.left_arm.suspension).concat(threeZeros);
            this.state = this.state.concat(model.right_leg.knee).concat(threeZeros).concat(model.right_leg.ankle).concat(threeZeros).concat(model.right_leg.suspension).concat(threeZeros);
            this.state = this.state.concat(model.left_leg.knee).concat(threeZeros).concat(model.left_leg.ankle).concat(threeZeros).concat(model.left_leg.suspension).concat(threeZeros);

            this.body.setInitialSuspension(Extremeties.ARM_RIGHT, [-25, 120, 60]);
            this.body.setInitialSuspension(Extremeties.ARM_LEFT, [25, 120, 60]);
            this.body.setInitialSuspension(Extremeties.LEG_RIGHT, [-65, 130, 15]);
            this.body.setInitialSuspension(Extremeties.LEG_LEFT, [65, 130, 15]);

            this.body.setInitialAnchor(Extremeties.ARM_RIGHT, model.body.right_shoulder);
            this.body.setInitialAnchor(Extremeties.ARM_LEFT, model.body.left_shoulder);
            this.body.setInitialAnchor(Extremeties.LEG_RIGHT, model.body.right_pelvis);
            this.body.setInitialAnchor(Extremeties.LEG_LEFT, model.body.left_pelvis);

            this.body.setNominals(Extremeties.ARM_RIGHT, [this.distance(model.body.right_shoulder, model.right_arm.elbow), this.distance(model.right_arm.elbow, model.right_arm.wrist), this.distance(model.right_arm.wrist, model.right_arm.suspension)]);
            this.body.setNominals(Extremeties.ARM_LEFT, [this.distance(model.body.left_shoulder, model.left_arm.elbow), this.distance(model.left_arm.elbow, model.left_arm.wrist), this.distance(model.left_arm.wrist, model.left_arm.suspension)]);
            this.body.setNominals(Extremeties.LEG_RIGHT, [this.distance(model.body.right_pelvis, model.right_leg.knee), this.distance(model.right_leg.knee, model.right_leg.ankle), this.distance(model.right_leg.knee, model.right_leg.suspension)]);
            this.body.setNominals(Extremeties.LEG_LEFT, [this.distance(model.body.left_pelvis, model.left_leg.knee), this.distance(model.left_leg.knee, model.left_leg.ankle), this.distance(model.left_leg.knee, model.left_leg.suspension)]);

            this.torso = new THREE.Object3D(); scene.add(this.torso); this.torso.rotation.order = 'ZYX';
            this.head = new THREE.Object3D(); this.torso.add(this.head); this.head.rotation.order = 'ZYX';
            this.bonesAndJoint = new BonesAndJoints();
            this.loadTorso(this.torso, this.head, this);

            this.bonesAndJoint.left_eye = new Objects.Sphere(this.head);
            this.bonesAndJoint.right_eye = new Objects.Sphere(this.head);
            this.bonesAndJoint.left_eye.centerPoint = this.body.head.locLeftEye;
            this.bonesAndJoint.right_eye.centerPoint = this.body.head.locRightEye;
            //this.bonesAndJoint.head = new Objects.Sphere(this.torso, 14);
            //this.bonesAndJoint.head.centerPoint = new THREE.Vector3(model.body.head[0], model.body.head[1], model.body.head[2]);
            //this.bonesAndJoint.coxis = new Objects.Sphere(this.torso);
            //this.bonesAndJoint.coxis.centerPoint = new THREE.Vector3(model.body.coxis[0], model.body.coxis[1], model.body.coxis[2]);
            //this.bonesAndJoint.neck = new Objects.Sphere(this.torso);
            //this.bonesAndJoint.neck.centerPoint = new THREE.Vector3(model.body.neck[0], model.body.neck[1], model.body.neck[2]);
            //this.bonesAndJoint.left_shoulder = new Objects.Sphere(this.torso);
            //this.bonesAndJoint.left_shoulder.centerPoint = new THREE.Vector3(model.body.left_shoulder[0], model.body.left_shoulder[1], model.body.left_shoulder[2]);
            //this.bonesAndJoint.right_shoulder = new Objects.Sphere(this.torso);
            //this.bonesAndJoint.right_shoulder.centerPoint = new THREE.Vector3(model.body.right_shoulder[0], model.body.right_shoulder[1], model.body.right_shoulder[2]);
            //this.bonesAndJoint.left_hip = new Objects.Sphere(this.torso);
            //this.bonesAndJoint.left_hip.centerPoint = new THREE.Vector3(model.body.left_pelvis[0], model.body.left_pelvis[1], model.body.left_pelvis[2]);
            //this.bonesAndJoint.right_hip = new Objects.Sphere(this.torso);
            //this.bonesAndJoint.right_hip.centerPoint = new THREE.Vector3(model.body.right_pelvis[0], model.body.right_pelvis[1], model.body.right_pelvis[2]);
            //this.bonesAndJoint.spine = new Objects.Cylinder(this.torso, this.distance(model.body.coxis, model.body.neck));
            //this.bonesAndJoint.spine.startPoint = new THREE.Vector3(model.body.coxis[0], model.body.coxis[1], model.body.coxis[2]);
            //this.bonesAndJoint.spine.endPoint = new THREE.Vector3(model.body.neck[0], model.body.neck[1], model.body.neck[2]);
            //this.bonesAndJoint.collar = new Objects.Cylinder(this.torso, this.distance(model.body.left_shoulder, model.body.right_shoulder));
            //this.bonesAndJoint.collar.startPoint = new THREE.Vector3(model.body.left_shoulder[0], model.body.left_shoulder[1], model.body.left_shoulder[2]);
            //this.bonesAndJoint.collar.endPoint = new THREE.Vector3(model.body.right_shoulder[0], model.body.right_shoulder[1], model.body.right_shoulder[2]);
            //this.bonesAndJoint.pelvis = new Objects.Cylinder(this.torso, this.distance(model.body.left_pelvis, model.body.right_pelvis));
            //this.bonesAndJoint.pelvis.startPoint = new THREE.Vector3(model.body.left_pelvis[0], model.body.left_pelvis[1], model.body.left_pelvis[2]);
            //this.bonesAndJoint.pelvis.endPoint = new THREE.Vector3(model.body.right_pelvis[0], model.body.right_pelvis[1], model.body.right_pelvis[2]);

            this.bonesAndJoint.left_elbow = new Objects.Sphere(scene);
            this.bonesAndJoint.left_elbow.centerPoint = new THREE.Vector3(model.left_arm.elbow[0], model.left_arm.elbow[1], model.left_arm.elbow[2]);
            this.bonesAndJoint.left_wrist = new Objects.Sphere(scene);
            this.bonesAndJoint.left_wrist.centerPoint = new THREE.Vector3(model.left_arm.wrist[0], model.left_arm.wrist[1], model.left_arm.wrist[2]);
            var anchor = new THREE.Vector3(model.body.left_shoulder[0], model.body.left_shoulder[1], model.body.left_shoulder[2]);
            this.bonesAndJoint.left_upper_arm = new Objects.Cylinder(scene, this.distance(anchor.toArray(), model.left_arm.elbow));
            this.bonesAndJoint.left_upper_arm.startPoint = anchor;
            this.bonesAndJoint.left_upper_arm.endPoint = this.bonesAndJoint.left_elbow.centerPoint;
            this.bonesAndJoint.left_lower_arm = new Objects.Cylinder(scene, this.distance(model.left_arm.wrist, model.left_arm.elbow));
            this.bonesAndJoint.left_lower_arm.startPoint = this.bonesAndJoint.left_wrist.centerPoint;
            this.bonesAndJoint.left_lower_arm.endPoint = this.bonesAndJoint.left_elbow.centerPoint;

            this.bonesAndJoint.right_elbow = new Objects.Sphere(scene);
            this.bonesAndJoint.right_elbow.centerPoint = new THREE.Vector3(model.right_arm.elbow[0], model.right_arm.elbow[1], model.right_arm.elbow[2]);
            this.bonesAndJoint.right_wrist = new Objects.Sphere(scene);
            this.bonesAndJoint.right_wrist.centerPoint = new THREE.Vector3(model.right_arm.wrist[0], model.right_arm.wrist[1], model.right_arm.wrist[2]);
            var anchor = new THREE.Vector3(model.body.right_shoulder[0], model.body.right_shoulder[1], model.body.right_shoulder[2]);
            this.bonesAndJoint.right_upper_arm = new Objects.Cylinder(scene, this.distance(anchor.toArray(), model.right_arm.elbow));
            this.bonesAndJoint.right_upper_arm.startPoint = anchor;
            this.bonesAndJoint.right_upper_arm.endPoint = this.bonesAndJoint.right_elbow.centerPoint;
            this.bonesAndJoint.right_lower_arm = new Objects.Cylinder(scene, this.distance(model.right_arm.wrist, model.right_arm.elbow));
            this.bonesAndJoint.right_lower_arm.startPoint = this.bonesAndJoint.right_wrist.centerPoint;
            this.bonesAndJoint.right_lower_arm.endPoint = this.bonesAndJoint.right_elbow.centerPoint;

            this.bonesAndJoint.left_knee = new Objects.Sphere(scene);
            this.bonesAndJoint.left_knee.centerPoint = new THREE.Vector3(model.left_leg.knee[0], model.left_leg.knee[1], model.left_leg.knee[2]);
            this.bonesAndJoint.left_ankle = new Objects.Sphere(scene);
            this.bonesAndJoint.left_ankle.centerPoint = new THREE.Vector3(model.left_leg.ankle[0], model.left_leg.ankle[1], model.left_leg.ankle[2]);
            var anchor = new THREE.Vector3(model.body.left_pelvis[0], model.body.left_pelvis[1], model.body.left_pelvis[2]);
            this.bonesAndJoint.left_thigh = new Objects.Cylinder(scene, this.distance(model.left_leg.knee, anchor.toArray()));
            this.bonesAndJoint.left_thigh.startPoint = anchor;
            this.bonesAndJoint.left_thigh.endPoint = this.bonesAndJoint.left_knee.centerPoint;
            this.bonesAndJoint.left_shin = new Objects.Cylinder(scene, this.distance(model.left_leg.knee, model.left_leg.ankle));
            this.bonesAndJoint.left_shin.startPoint = this.bonesAndJoint.left_ankle.centerPoint;
            this.bonesAndJoint.left_shin.endPoint = this.bonesAndJoint.left_knee.centerPoint;

            this.bonesAndJoint.right_knee = new Objects.Sphere(scene);
            this.bonesAndJoint.right_knee.centerPoint = new THREE.Vector3(model.right_leg.knee[0], model.right_leg.knee[1], model.right_leg.knee[2]);
            this.bonesAndJoint.right_ankle = new Objects.Sphere(scene);
            this.bonesAndJoint.right_ankle.centerPoint = new THREE.Vector3(model.right_leg.ankle[0], model.right_leg.ankle[1], model.right_leg.ankle[2]);

            var anchor = new THREE.Vector3(model.body.right_pelvis[0], model.body.right_pelvis[1], model.body.right_pelvis[2]);
            this.bonesAndJoint.right_thigh = new Objects.Cylinder(scene, this.distance(model.right_leg.knee, anchor.toArray()));
            this.bonesAndJoint.right_thigh.startPoint = anchor;
            this.bonesAndJoint.right_thigh.endPoint = this.bonesAndJoint.right_knee.centerPoint;
            this.bonesAndJoint.right_shin = new Objects.Cylinder(scene, this.distance(model.right_leg.knee, model.right_leg.ankle));
            this.bonesAndJoint.right_shin.startPoint = this.bonesAndJoint.right_ankle.centerPoint;
            this.bonesAndJoint.right_shin.endPoint = this.bonesAndJoint.right_knee.centerPoint;

        }

        private distance(a: number[], b: number[]) {
            var distSqr = 0;
            for (var i = 0; i < a.length; i++) {
                distSqr += (a[i] - b[i]) ** 2;
            }
            return Math.sqrt(distSqr);
        }

        private loadTorso(torso: THREE.Object3D, head: THREE.Object3D, that: Solver) {
            var loader: THREE.JSONLoader = new THREE.JSONLoader();
            loader.load("json/cartoonskeleton/skull.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                mesh.scale.x = 20;
                mesh.scale.y = 20;
                mesh.scale.z = 20;
                head.translateY(87);
                head.add(mesh);
            });
            loader.load("json/cartoonskeleton/jaw.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                mesh.scale.x = 20;
                mesh.scale.y = 20;
                mesh.scale.z = 20;
                //mesh.translateY(87);
                mesh.name = "jaw";
                that.jaw = mesh;
                head.add(mesh);
            });
            loader.load("json/cartoonskeleton/torso.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 25;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.translateZ(0.32108 * scale);
                mesh.translateY(0.49917 * scale);
                torso.add(mesh);
            });
        }

    }
}