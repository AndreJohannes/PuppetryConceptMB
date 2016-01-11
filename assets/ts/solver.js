/// <reference path="three.d.ts" />
/// <reference path="rungekutta.ts" />
/// <reference path="./solvers/bodysolver.ts" />
var Solver;
(function (Solver_1) {
    (function (Commands) {
        Commands[Commands["JawOpen"] = 1] = "JawOpen";
        Commands[Commands["JawClose"] = 2] = "JawClose";
        Commands[Commands["LeftLegTwist"] = 3] = "LeftLegTwist";
        Commands[Commands["RightLegTwist"] = 4] = "RightLegTwist";
        Commands[Commands["PlayAudio"] = 5] = "PlayAudio";
        Commands[Commands["StopAudio"] = 6] = "StopAudio";
        Commands[Commands["RoleEyes"] = 7] = "RoleEyes";
        Commands[Commands["StopEyes"] = 8] = "StopEyes";
    })(Solver_1.Commands || (Solver_1.Commands = {}));
    var Commands = Solver_1.Commands;
    (function (Mode) {
        Mode[Mode["None"] = 0] = "None";
        Mode[Mode["LeftTwist"] = 1] = "LeftTwist";
    })(Solver_1.Mode || (Solver_1.Mode = {}));
    var Mode = Solver_1.Mode;
    var FallbackModel = (function () {
        function FallbackModel() {
            this.body = {
                "head": [0, 87, 0],
                "coxis": [0, 0, 0],
                "neck": [0, 60, 0],
                "left_shoulder": [25, 60, 0],
                "right_shoulder": [-25, 60, 0],
                "left_pelvis": [15, 0, 0],
                "right_pelvis": [-15, 0, 0]
            };
            this.left_arm = {
                "elbow": [25, 20, 5],
                "wrist": [25, 20, 45],
                "suspension": [25, 120, 60]
            };
            this.right_arm = {
                "elbow": [-25, 20, 5],
                "wrist": [-25, 20, 45],
                "suspension": [-25, 120, 60]
            };
            this.left_leg = {
                "knee": [15, -45, 0],
                "ankle": [15, -90, 0],
                "suspension": [15, 120, 45]
            };
            this.right_leg = {
                "knee": [-15, -45, 0],
                "ankle": [-15, -90, 0],
                "suspension": [-15, 120, 45]
            };
        }
        return FallbackModel;
    })();
    var BonesAndJoints = (function () {
        function BonesAndJoints() {
        }
        return BonesAndJoints;
    })();
    var Solver = (function () {
        function Solver(scene) {
            this.body = new Solver_1.Body();
            this.rkSolver = new RungeKutta.RungeKuttaSolver4th(this.body);
            this.time = 0;
            this.dt = .01;
            this.addModel(scene, new FallbackModel());
        }
        Solver.prototype.solve = function () {
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
            var arm = this.body.extremeties[Solver_1.Extremeties.ARM_RIGHT.toString()];
            this.bonesAndJoint.right_upper_arm.startPoint = arm.getRotatedAnchor();
            this.bonesAndJoint.right_upper_arm.endPoint = this.bonesAndJoint.right_elbow.centerPoint;
            this.bonesAndJoint.right_lower_arm.startPoint = this.bonesAndJoint.right_elbow.centerPoint;
            this.bonesAndJoint.right_lower_arm.endPoint = this.bonesAndJoint.right_wrist.centerPoint;
            offset = offset + 18;
            this.bonesAndJoint.left_elbow.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.left_wrist.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            var arm = this.body.extremeties[Solver_1.Extremeties.ARM_LEFT.toString()];
            this.bonesAndJoint.left_upper_arm.startPoint = arm.getRotatedAnchor();
            this.bonesAndJoint.left_upper_arm.endPoint = this.bonesAndJoint.left_elbow.centerPoint;
            this.bonesAndJoint.left_lower_arm.startPoint = this.bonesAndJoint.left_elbow.centerPoint;
            this.bonesAndJoint.left_lower_arm.endPoint = this.bonesAndJoint.left_wrist.centerPoint;
            offset = offset + 18;
            this.bonesAndJoint.right_knee.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.right_ankle.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            this.bonesAndJoint.right_thigh.startPoint = this.body.extremeties[Solver_1.Extremeties.LEG_RIGHT.toString()].getRotatedAnchor();
            this.bonesAndJoint.right_thigh.endPoint = this.bonesAndJoint.right_knee.centerPoint;
            this.bonesAndJoint.right_shin.startPoint = this.bonesAndJoint.right_knee.centerPoint;
            this.bonesAndJoint.right_shin.endPoint = this.bonesAndJoint.right_ankle.centerPoint;
            offset = offset + 18;
            this.bonesAndJoint.left_knee.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.left_ankle.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            this.bonesAndJoint.left_thigh.startPoint = this.body.extremeties[Solver_1.Extremeties.LEG_LEFT.toString()].getRotatedAnchor();
            this.bonesAndJoint.left_thigh.endPoint = this.bonesAndJoint.left_knee.centerPoint;
            this.bonesAndJoint.left_shin.startPoint = this.bonesAndJoint.left_knee.centerPoint;
            this.bonesAndJoint.left_shin.endPoint = this.bonesAndJoint.left_ankle.centerPoint;
            this.time += this.dt;
        };
        Solver.prototype.setVolante = function (orientation, accelerations, mode) {
            this.body.setEulersAndAccelerations(-orientation[0], -orientation[1], -orientation[2], accelerations[0], accelerations[1], orientation[3], mode);
        };
        Solver.prototype.openJaw = function () {
            this.jaw.position.y = -1;
        };
        Solver.prototype.closeJaw = function () {
            this.jaw.position.y = 2;
        };
        Solver.prototype.getState = function () {
            return this.state;
        };
        Solver.prototype.roleEyes = function (start) {
            if (start === void 0) { start = true; }
            if (start == true)
                this.body.head.rollEyes();
            else
                this.body.head.stopEyes();
        };
        Solver.prototype.addModel = function (scene, model) {
            var threeZeros = [0, 0, 0];
            this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.state = this.state.concat(model.right_arm.elbow).concat(threeZeros).concat(model.right_arm.wrist).concat(threeZeros).concat(model.right_arm.suspension).concat(threeZeros);
            this.state = this.state.concat(model.left_arm.elbow).concat(threeZeros).concat(model.left_arm.wrist).concat(threeZeros).concat(model.left_arm.suspension).concat(threeZeros);
            this.state = this.state.concat(model.right_leg.knee).concat(threeZeros).concat(model.right_leg.ankle).concat(threeZeros).concat(model.right_leg.suspension).concat(threeZeros);
            this.state = this.state.concat(model.left_leg.knee).concat(threeZeros).concat(model.left_leg.ankle).concat(threeZeros).concat(model.left_leg.suspension).concat(threeZeros);
            this.body.setInitialSuspension(Solver_1.Extremeties.ARM_RIGHT, [-25, 120, 60]);
            this.body.setInitialSuspension(Solver_1.Extremeties.ARM_LEFT, [25, 120, 60]);
            this.body.setInitialSuspension(Solver_1.Extremeties.LEG_RIGHT, [-65, 130, 15]);
            this.body.setInitialSuspension(Solver_1.Extremeties.LEG_LEFT, [65, 130, 15]);
            this.body.setInitialAnchor(Solver_1.Extremeties.ARM_RIGHT, model.body.right_shoulder);
            this.body.setInitialAnchor(Solver_1.Extremeties.ARM_LEFT, model.body.left_shoulder);
            this.body.setInitialAnchor(Solver_1.Extremeties.LEG_RIGHT, model.body.right_pelvis);
            this.body.setInitialAnchor(Solver_1.Extremeties.LEG_LEFT, model.body.left_pelvis);
            this.body.setNominals(Solver_1.Extremeties.ARM_RIGHT, [this.distance(model.body.right_shoulder, model.right_arm.elbow), this.distance(model.right_arm.elbow, model.right_arm.wrist), this.distance(model.right_arm.wrist, model.right_arm.suspension)]);
            this.body.setNominals(Solver_1.Extremeties.ARM_LEFT, [this.distance(model.body.left_shoulder, model.left_arm.elbow), this.distance(model.left_arm.elbow, model.left_arm.wrist), this.distance(model.left_arm.wrist, model.left_arm.suspension)]);
            this.body.setNominals(Solver_1.Extremeties.LEG_RIGHT, [this.distance(model.body.right_pelvis, model.right_leg.knee), this.distance(model.right_leg.knee, model.right_leg.ankle), this.distance(model.right_leg.knee, model.right_leg.suspension)]);
            this.body.setNominals(Solver_1.Extremeties.LEG_LEFT, [this.distance(model.body.left_pelvis, model.left_leg.knee), this.distance(model.left_leg.knee, model.left_leg.ankle), this.distance(model.left_leg.knee, model.left_leg.suspension)]);
            this.torso = new THREE.Object3D();
            scene.add(this.torso);
            this.torso.rotation.order = 'ZYX';
            this.head = new THREE.Object3D();
            this.torso.add(this.head);
            this.head.rotation.order = 'ZYX';
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
        };
        Solver.prototype.distance = function (a, b) {
            var distSqr = 0;
            for (var i = 0; i < a.length; i++) {
                distSqr += Math.pow((a[i] - b[i]), 2);
            }
            return Math.sqrt(distSqr);
        };
        Solver.prototype.loadTorso = function (torso, head, that) {
            var loader = new THREE.JSONLoader();
            loader.load("json/cartoonskeleton/skull.json", function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                mesh.scale.x = 20;
                mesh.scale.y = 20;
                mesh.scale.z = 20;
                head.translateY(87);
                head.add(mesh);
            });
            loader.load("json/cartoonskeleton/jaw.json", function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                mesh.scale.x = 20;
                mesh.scale.y = 20;
                mesh.scale.z = 20;
                //mesh.translateY(87);
                mesh.name = "jaw";
                that.jaw = mesh;
                head.add(mesh);
            });
            loader.load("json/cartoonskeleton/torso.json", function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 25;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.translateZ(0.32108 * scale);
                mesh.translateY(0.49917 * scale);
                torso.add(mesh);
            });
        };
        return Solver;
    })();
    Solver_1.Solver = Solver;
})(Solver || (Solver = {}));
