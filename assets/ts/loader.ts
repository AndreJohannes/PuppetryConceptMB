module Loader {

    export class Loader {

        public static loadTorso(torso: THREE.Object3D, head: THREE.Object3D, that: Solver.Solver) {
            var loader: THREE.JSONLoader = new THREE.JSONLoader();
            loader.load("json/evilskull/skull.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                mesh.scale.x = 20;
                mesh.scale.y = 18;
                mesh.scale.z = 18;
                mesh.castShadow = true;
                //head.translateY(47);
                head.add(mesh);
            });
            loader.load("json/evilskull/jaw.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                mesh.scale.x = 20;
                mesh.scale.y = 18;
                mesh.scale.z = 18;
                //mesh.translateY(87);
                mesh.name = "jaw";
                that.setJaw(mesh);
                head.add(mesh);
            });
            loader.load("json/cartoonskeleton/torso.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 25;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.castShadow = true;
                mesh.translateZ(0.32108 * scale);
                mesh.translateY(0.49917 * scale - 60);
                torso.add(mesh);
            });
        }

       public static loadRightHand(arm: Objects.Cylinder, that: Solver.Solver) {
            var loader: THREE.JSONLoader = new THREE.JSONLoader();
            loader.load("json/righthand.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 1.3;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.castShadow = true;
                var object: THREE.Object3D = new THREE.Object3D();
                object.translateY(45. / 2.);
                //object.translateX(-25);
                //object.translateY(-20);
                object.add(mesh);
                mesh.rotateX(3.14159 / 2);
                mesh.rotateZ(3.14159 / 3.);
                arm.addObject(object);
            });
        }

        public static loadLeftHand(arm: Objects.Cylinder, that: Solver.Solver) {
            var loader: THREE.JSONLoader = new THREE.JSONLoader();
            loader.load("json/lefthand.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 1.3;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.castShadow = true;
                var object: THREE.Object3D = new THREE.Object3D();
                object.translateY(45 / 2.);
                //object.translateX(25);
                //object.translateY(-20);
                object.add(mesh);
                mesh.rotateX(3.14159 / 2.);
                mesh.rotateZ(-3.14159 / 3.);
                arm.addObject(object);
            });
        }

        public static loadRightBoot(arm: Objects.Cylinder, that: Solver.Solver) {
            var loader: THREE.JSONLoader = new THREE.JSONLoader();
            loader.load("json/rightboot.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 22;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.castShadow = true;
                var object: THREE.Object3D = new THREE.Object3D();
                object.translateY(55. / 2.);
                object.translateZ(-9);
                //object.translateY(-20);
                object.add(mesh);
                mesh.rotateZ(3.14159);
                mesh.rotateY(3.14159);
                arm.addObject(object);
            });
        }

        public static loadLeftBoot(arm: Objects.Cylinder, that: Solver.Solver) {
            var loader: THREE.JSONLoader = new THREE.JSONLoader();
            loader.load("json/leftboot.json", function(geometry, material) {
                var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                var scale = 22;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
                mesh.scale.z = scale;
                mesh.castShadow = true;
                var object: THREE.Object3D = new THREE.Object3D();
                object.translateY(55. / 2.);
                object.translateZ(-9);
                //object.translateY(-20);
                object.add(mesh);
                mesh.rotateZ(3.14159);
                mesh.rotateY(3.14159);
                arm.addObject(object);
            });
        }


    }

}