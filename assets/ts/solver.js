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
        Commands[Commands["MoveLeftArm"] = 7] = "MoveLeftArm";
        Commands[Commands["MoveRightArm"] = 8] = "MoveRightArm";
    })(Solver_1.Commands || (Solver_1.Commands = {}));
    var Commands = Solver_1.Commands;
    (function (Mode) {
        Mode[Mode["None"] = 0] = "None";
        Mode[Mode["LeftTwist"] = 1] = "LeftTwist";
    })(Solver_1.Mode || (Solver_1.Mode = {}));
    var Mode = Solver_1.Mode;
    var FallbackModel = (function () {
        function FallbackModel() {
            this.offset = [0, 60, 0];
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
            this.applyOffset(this.body, this.offset);
            this.applyOffset(this.left_arm, this.offset);
            this.applyOffset(this.right_arm, this.offset);
            this.applyOffset(this.left_leg, this.offset);
            this.applyOffset(this.right_leg, this.offset);
        }
        FallbackModel.prototype.applyOffset = function (area, offset) {
            for (var key in area) {
                if (area.hasOwnProperty(key)) {
                    var point = area[key];
                    for (var i = 0; i < 3; i++) {
                        point[i] -= offset[i];
                    }
                }
            }
        };
        return FallbackModel;
    })();
    var BonesAndJoints = (function () {
        function BonesAndJoints() {
        }
        return BonesAndJoints;
    })();
    var Solver = (function () {
        function Solver(scene) {
            this.bodySolver = new Solver_1.Body();
            this.rkSolver = new RungeKutta.RungeKuttaSolver4th(this.bodySolver);
            this.time = 0;
            this.dt = .01;
            this.addModel(scene, new FallbackModel());
        }
        Solver.prototype.solve = function () {
            //return;
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
            this.torso.rotation.z = this.state[4];
            this.torso.rotation.x = this.state[2];
            this.torso.rotation.y = this.state[0];
            this.torso.position.y = this.state[6];
            this.torso.position.x = this.state[8];
            this.torso.position.z = this.state[10];
            this.head.position.y = 21 + this.state[12];
            this.head.rotation.x = this.state[2];
            this.head.rotation.y = this.state[14];
            this.head.rotation.z = this.state[16];
            this.bonesAndJoint.left_eye.centerPoint = this.bodySolver.head.locLeftEye;
            this.bonesAndJoint.right_eye.centerPoint = this.bodySolver.head.locRightEye;
            var offset = 18;
            this.bonesAndJoint.right_elbow.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.right_wrist.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            var arm = this.bodySolver.extremeties[Solver_1.Extremeties.ARM_RIGHT.toString()];
            this.bonesAndJoint.right_upper_arm.startPoint = arm.getRotatedAnchor();
            this.bonesAndJoint.right_upper_arm.endPoint = this.bonesAndJoint.right_elbow.centerPoint;
            this.bonesAndJoint.right_lower_arm.startPoint = this.bonesAndJoint.right_elbow.centerPoint;
            this.bonesAndJoint.right_lower_arm.endPoint = this.bonesAndJoint.right_wrist.centerPoint;
            offset = offset + 18;
            this.bonesAndJoint.left_elbow.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.left_wrist.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            var arm = this.bodySolver.extremeties[Solver_1.Extremeties.ARM_LEFT.toString()];
            this.bonesAndJoint.left_upper_arm.startPoint = arm.getRotatedAnchor();
            this.bonesAndJoint.left_upper_arm.endPoint = this.bonesAndJoint.left_elbow.centerPoint;
            this.bonesAndJoint.left_lower_arm.startPoint = this.bonesAndJoint.left_elbow.centerPoint;
            this.bonesAndJoint.left_lower_arm.endPoint = this.bonesAndJoint.left_wrist.centerPoint;
            offset = offset + 18;
            this.bonesAndJoint.right_knee.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.right_ankle.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            var startPoint = this.bodySolver.extremeties[Solver_1.Extremeties.LEG_RIGHT.toString()].getRotatedAnchor();
            var endPoint = this.bonesAndJoint.right_knee.centerPoint;
            this.bonesAndJoint.right_thigh.startPoint = startPoint;
            this.bonesAndJoint.right_thigh.endPoint = endPoint;
            this.bonesAndJoint.right_shin.startPoint = this.bonesAndJoint.right_knee.centerPoint;
            this.bonesAndJoint.right_shin.endPoint = this.bonesAndJoint.right_ankle.centerPoint;
            var angle = Math.atan2(startPoint.x - endPoint.x, -startPoint.z + endPoint.z);
            this.bonesAndJoint.right_shin.angle = angle - 0.5;
            offset = offset + 12;
            this.bonesAndJoint.left_knee.centerPoint = new THREE.Vector3(this.state[offset], this.state[offset + 1], this.state[offset + 2]);
            this.bonesAndJoint.left_ankle.centerPoint = new THREE.Vector3(this.state[offset + 6], this.state[offset + 7], this.state[offset + 8]);
            var leg = this.bodySolver.extremeties[Solver_1.Extremeties.LEG_LEFT.toString()];
            startPoint = leg.getRotatedAnchor();
            ;
            endPoint = this.bonesAndJoint.left_knee.centerPoint;
            this.bonesAndJoint.left_thigh.startPoint = startPoint;
            this.bonesAndJoint.left_thigh.endPoint = endPoint;
            this.bonesAndJoint.left_shin.startPoint = this.bonesAndJoint.left_knee.centerPoint;
            this.bonesAndJoint.left_shin.endPoint = this.bonesAndJoint.left_ankle.centerPoint;
            var angle = (!leg.hasTwist) ? Math.atan2(startPoint.x - endPoint.x, -startPoint.z + endPoint.z) :
                Math.atan2(-this.bonesAndJoint.left_knee.centerPoint.x + this.bonesAndJoint.left_ankle.centerPoint.x, this.bonesAndJoint.left_knee.centerPoint.z - this.bonesAndJoint.left_ankle.centerPoint.z);
            this.bonesAndJoint.left_shin.angle = angle;
            this.time += this.dt;
        };
        Solver.prototype.setVolante = function (orientation, accelerations, mode) {
            this.bodySolver.setEulersAndAccelerations(-orientation[0], -orientation[1], -orientation[2], accelerations[0], accelerations[1], orientation[3], mode);
        };
        Solver.prototype.openJaw = function () {
            this.jaw.position.y = -3;
        };
        Solver.prototype.closeJaw = function () {
            this.jaw.position.y = 0;
        };
        Solver.prototype.getState = function () {
            return this.state;
        };
        Solver.prototype.roleEyes = function (start) {
            if (start === void 0) { start = true; }
            if (start == true)
                this.bodySolver.head.rollEyes();
            else
                this.bodySolver.head.stopEyes();
        };
        Solver.prototype.addModel = function (scene, model) {
            var threeZeros = [0, 0, 0];
            this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.state = this.state.concat(model.right_arm.elbow).concat(threeZeros).concat(model.right_arm.wrist).concat(threeZeros).concat(model.right_arm.suspension).concat(threeZeros);
            this.state = this.state.concat(model.left_arm.elbow).concat(threeZeros).concat(model.left_arm.wrist).concat(threeZeros).concat(model.left_arm.suspension).concat(threeZeros);
            this.state = this.state.concat(model.right_leg.knee).concat(threeZeros).concat(model.right_leg.ankle).concat(threeZeros);
            this.state = this.state.concat(model.left_leg.knee).concat(threeZeros).concat(model.left_leg.ankle).concat(threeZeros);
            this.bodySolver.setInitialSuspension(Solver_1.Extremeties.ARM_RIGHT, [-25, 80, 60]);
            this.bodySolver.setInitialSuspension(Solver_1.Extremeties.ARM_LEFT, [25, 80, 60]);
            this.bodySolver.setInitialSuspension(Solver_1.Extremeties.LEG_RIGHT, [-65, 90, 15]);
            this.bodySolver.setInitialSuspension(Solver_1.Extremeties.LEG_LEFT, [65, 90, 15]);
            this.bodySolver.setInitialAnchor(Solver_1.Extremeties.ARM_RIGHT, model.body.right_shoulder);
            this.bodySolver.setInitialAnchor(Solver_1.Extremeties.ARM_LEFT, model.body.left_shoulder);
            this.bodySolver.setInitialAnchor(Solver_1.Extremeties.LEG_RIGHT, model.body.right_pelvis);
            this.bodySolver.setInitialAnchor(Solver_1.Extremeties.LEG_LEFT, model.body.left_pelvis);
            this.bodySolver.setNominals(Solver_1.Extremeties.ARM_RIGHT, [this.distance(model.body.right_shoulder, model.right_arm.elbow), this.distance(model.right_arm.elbow, model.right_arm.wrist), this.distance(model.right_arm.wrist, model.right_arm.suspension)]);
            this.bodySolver.setNominals(Solver_1.Extremeties.ARM_LEFT, [this.distance(model.body.left_shoulder, model.left_arm.elbow), this.distance(model.left_arm.elbow, model.left_arm.wrist), this.distance(model.left_arm.wrist, model.left_arm.suspension)]);
            this.bodySolver.setNominals(Solver_1.Extremeties.LEG_RIGHT, [this.distance(model.body.right_pelvis, model.right_leg.knee), this.distance(model.right_leg.knee, model.right_leg.ankle), this.distance(model.right_leg.knee, model.right_leg.suspension)]);
            this.bodySolver.setNominals(Solver_1.Extremeties.LEG_LEFT, [this.distance(model.body.left_pelvis, model.left_leg.knee), this.distance(model.left_leg.knee, model.left_leg.ankle), this.distance(model.left_leg.knee, model.left_leg.suspension)]);
            this.body = new THREE.Object3D();
            scene.add(this.body);
            this.body.position.y = 140;
            this.torso = new THREE.Object3D();
            this.body.add(this.torso);
            this.torso.rotation.order = 'YXZ'; // Means Y last
            this.head = new THREE.Object3D();
            this.torso.add(this.head);
            this.head.rotation.order = 'ZYX';
            this.bonesAndJoint = new BonesAndJoints();
            this.loadTorso(this.torso, this.head, this);
            this.bonesAndJoint.left_eye = new Objects.Sphere(this.head, 0);
            this.bonesAndJoint.right_eye = new Objects.Sphere(this.head, 0);
            this.bonesAndJoint.left_eye.centerPoint = this.bodySolver.head.locLeftEye;
            this.bonesAndJoint.right_eye.centerPoint = this.bodySolver.head.locRightEye;
            this.bonesAndJoint.left_elbow = new Objects.Sphere(this.body);
            this.bonesAndJoint.left_elbow.centerPoint = new THREE.Vector3(model.left_arm.elbow[0], model.left_arm.elbow[1], model.left_arm.elbow[2]);
            this.bonesAndJoint.left_wrist = new Objects.Sphere(this.body);
            this.bonesAndJoint.left_wrist.centerPoint = new THREE.Vector3(model.left_arm.wrist[0], model.left_arm.wrist[1], model.left_arm.wrist[2]);
            var anchor = new THREE.Vector3(model.body.left_shoulder[0], model.body.left_shoulder[1], model.body.left_shoulder[2]);
            this.bonesAndJoint.left_upper_arm = new Objects.Cylinder(this.body, this.distance(anchor.toArray(), model.left_arm.elbow));
            this.bonesAndJoint.left_upper_arm.startPoint = anchor;
            this.bonesAndJoint.left_upper_arm.endPoint = this.bonesAndJoint.left_elbow.centerPoint;
            this.bonesAndJoint.left_lower_arm = new Objects.Cylinder(this.body, this.distance(model.left_arm.wrist, model.left_arm.elbow));
            this.bonesAndJoint.left_lower_arm.startPoint = this.bonesAndJoint.left_wrist.centerPoint;
            this.bonesAndJoint.left_lower_arm.endPoint = this.bonesAndJoint.left_elbow.centerPoint;
            this.loadLeftHand(this.bonesAndJoint.left_lower_arm, this);
            this.bonesAndJoint.right_elbow = new Objects.Sphere(this.body);
            this.bonesAndJoint.right_elbow.centerPoint = new THREE.Vector3(model.right_arm.elbow[0], model.right_arm.elbow[1], model.right_arm.elbow[2]);
            this.bonesAndJoint.right_wrist = new Objects.Sphere(this.body);
            this.bonesAndJoint.right_wrist.centerPoint = new THREE.Vector3(model.right_arm.wrist[0], model.right_arm.wrist[1], model.right_arm.wrist[2]);
            var anchor = new THREE.Vector3(model.body.right_shoulder[0], model.body.right_shoulder[1], model.body.right_shoulder[2]);
            this.bonesAndJoint.right_upper_arm = new Objects.Cylinder(this.body, this.distance(anchor.toArray(), model.right_arm.elbow));
            this.bonesAndJoint.right_upper_arm.startPoint = anchor;
            this.bonesAndJoint.right_upper_arm.endPoint = this.bonesAndJoint.right_elbow.centerPoint;
            this.bonesAndJoint.right_lower_arm = new Objects.Cylinder(this.body, this.distance(model.right_arm.wrist, model.right_arm.elbow));
            this.bonesAndJoint.right_lower_arm.startPoint = this.bonesAndJoint.right_wrist.centerPoint;
            this.bonesAndJoint.right_lower_arm.endPoint = this.bonesAndJoint.right_elbow.centerPoint;
            this.loadRightHand(this.bonesAndJoint.right_lower_arm, this);
            this.bonesAndJoint.left_knee = new Objects.Sphere(this.body);
            this.bonesAndJoint.left_knee.centerPoint = new THREE.Vector3(model.left_leg.knee[0], model.left_leg.knee[1], model.left_leg.knee[2]);
            this.bonesAndJoint.left_ankle = new Objects.Sphere(this.body);
            this.bonesAndJoint.left_ankle.centerPoint = new THREE.Vector3(model.left_leg.ankle[0], model.left_leg.ankle[1], model.left_leg.ankle[2]);
            var anchor = new THREE.Vector3(model.body.left_pelvis[0], model.body.left_pelvis[1], model.body.left_pelvis[2]);
            this.bonesAndJoint.left_thigh = new Objects.Cylinder(this.body, this.distance(model.left_leg.knee, anchor.toArray()));
            this.bonesAndJoint.left_thigh.startPoint = anchor;
            this.bonesAndJoint.left_thigh.endPoint = this.bonesAndJoint.left_knee.centerPoint;
            this.bonesAndJoint.left_shin = new Objects.Cylinder(this.body, this.distance(model.left_leg.knee, model.left_leg.ankle));
            this.bonesAndJoint.left_shin.startPoint = this.bonesAndJoint.left_ankle.centerPoint;
            this.bonesAndJoint.left_shin.endPoint = this.bonesAndJoint.left_knee.centerPoint;
            this.loadLeftBoot(this.bonesAndJoint.left_shin, this);
            this.bonesAndJoint.right_knee = new Objects.Sphere(this.body);
            this.bonesAndJoint.right_knee.centerPoint = new THREE.Vector3(model.right_leg.knee[0], model.right_leg.knee[1], model.right_leg.knee[2]);
            this.bonesAndJoint.right_ankle = new Objects.Sphere(this.body);
            this.bonesAndJoint.right_ankle.centerPoint = new THREE.Vector3(model.right_leg.ankle[0], model.right_leg.ankle[1], model.right_leg.ankle[2]);
            var anchor = new THREE.Vector3(model.body.right_pelvis[0], model.body.right_pelvis[1], model.body.right_pelvis[2]);
            this.bonesAndJoint.right_thigh = new Objects.Cylinder(this.body, this.distance(model.right_leg.knee, anchor.toArray()));
            this.bonesAndJoint.right_thigh.startPoint = anchor;
            this.bonesAndJoint.right_thigh.endPoint = this.bonesAndJoint.right_knee.centerPoint;
            this.bonesAndJoint.right_shin = new Objects.Cylinder(this.body, this.distance(model.right_leg.knee, model.right_leg.ankle));
            this.bonesAndJoint.right_shin.startPoint = this.bonesAndJoint.right_ankle.centerPoint;
            this.bonesAndJoint.right_shin.endPoint = this.bonesAndJoint.right_knee.centerPoint;
            this.loadRightBoot(this.bonesAndJoint.right_shin, this);
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
            loader.load("json/evilskull/skull.json", function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                mesh.scale.x = 20;
                mesh.scale.y = 18;
                mesh.scale.z = 18;
                mesh.castShadow = true;
                //head.translateY(47);
                head.add(mesh);
            });
            loader.load("json/evilskull/jaw.json", function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                mesh.scale.x = 20;
                mesh.scale.y = 18;
                mesh.scale.z = 18;
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
                mesh.castShadow = true;
                mesh.translateZ(0.32108 * scale);
                mesh.translateY(0.49917 * scale - 40);
                torso.add(mesh);
            });
        };
        Solver.prototype.loadRightHand = function (arm, that) {
            var loader = new THREE.JSONLoader();
            loader.load("json/righthand.json", function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 1.3;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.castShadow = true;
                var object = new THREE.Object3D();
                object.translateY(45. / 2.);
                //object.translateX(-25);
                //object.translateY(-20);
                object.add(mesh);
                mesh.rotateX(3.14159 / 2);
                mesh.rotateZ(3.14159 / 3.);
                arm.addObject(object);
            });
        };
        Solver.prototype.loadLeftHand = function (arm, that) {
            var loader = new THREE.JSONLoader();
            loader.load("json/lefthand.json", function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 1.3;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.castShadow = true;
                var object = new THREE.Object3D();
                object.translateY(45 / 2.);
                //object.translateX(25);
                //object.translateY(-20);
                object.add(mesh);
                mesh.rotateX(3.14159 / 2.);
                mesh.rotateZ(-3.14159 / 3.);
                arm.addObject(object);
            });
        };
        Solver.prototype.loadRightBoot = function (arm, that) {
            var loader = new THREE.JSONLoader();
            loader.load("json/rightboot.json", function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 22;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.castShadow = true;
                var object = new THREE.Object3D();
                object.translateY(55. / 2.);
                object.translateZ(-9);
                //object.translateY(-20);
                object.add(mesh);
                mesh.rotateZ(3.14159);
                mesh.rotateY(3.14159);
                arm.addObject(object);
            });
        };
        Solver.prototype.loadLeftBoot = function (arm, that) {
            var loader = new THREE.JSONLoader();
            loader.load("json/leftboot.json", function (geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 22;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.castShadow = true;
                var object = new THREE.Object3D();
                object.translateY(55. / 2.);
                object.translateZ(-9);
                //object.translateY(-20);
                object.add(mesh);
                mesh.rotateZ(3.14159);
                mesh.rotateY(3.14159);
                arm.addObject(object);
            });
        };
        return Solver;
    })();
    Solver_1.Solver = Solver;
})(Solver || (Solver = {}));
