/// <reference path="../three.d.ts" />
/// <reference path="../solver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Solver;
(function (Solver) {
    var EyeState;
    (function (EyeState) {
        EyeState[EyeState["Started"] = 0] = "Started";
        EyeState[EyeState["Stop"] = 1] = "Stop";
        EyeState[EyeState["Fading"] = 2] = "Fading";
        EyeState[EyeState["Stopped"] = 3] = "Stopped";
    })(EyeState || (EyeState = {}));
    var LocationEye = (function (_super) {
        __extends(LocationEye, _super);
        function LocationEye(center, up, left) {
            _super.call(this, center.x, center.y, center.z);
            this.center = center;
            this.up = up;
            this.left = left;
        }
        LocationEye.prototype.setLocation = function (x, y) {
            this.x = this.center.x + x * this.left.x + y * this.up.x;
            this.y = this.center.y + x * this.left.y + y * this.up.y;
            this.z = this.center.z + x * this.left.z + y * this.up.z;
        };
        return LocationEye;
    })(THREE.Vector3);
    var Head = (function () {
        function Head(offset) {
            this.radius = 3;
            this.eyeState = EyeState.Stopped;
            this.offset = 12;
            this.acceleration = 0;
            this.alpha = 0;
            this.beta = 0;
            this.gamma = 0;
            this.offset = offset;
            var centerLeftEye = new THREE.Vector3(.38320 * 20, 0.04951 * 20, 0.73292 * 20);
            var upLeftEye = new THREE.Vector3(0.967638, 0., -0.252342);
            var leftLeftEye = new THREE.Vector3(0., 0.999691, -0.024849);
            this.locLeftEye = new LocationEye(centerLeftEye, upLeftEye, leftLeftEye);
            var centerRightEye = new THREE.Vector3(-.38320 * 20, 0.04951 * 20, 0.73292 * 20);
            var upRightEye = new THREE.Vector3(0.967638, 0., 0.252342);
            var leftRightEye = new THREE.Vector3(0., 0.999691, 0.024849);
            this.locRightEye = new LocationEye(centerRightEye, upRightEye, leftRightEye);
            //this._rollEyes(this, 0)();
        }
        Head.prototype.evaluate = function (state) {
            var z = state[this.offset];
            var zdot = state[this.offset + 1];
            var k = 1;
            var d = 0.5;
            var zdotdot = -k * z - d * zdot + this.acceleration;
            var theta = state[this.offset + 2];
            var thetadot = state[this.offset + 3];
            var k = 1;
            var d = 0.5;
            var thetadotdot = k * MathUtils.mod(this.alpha - theta) - d * thetadot;
            var phi = state[this.offset + 4];
            var phidot = state[this.offset + 5];
            k = 1;
            d = 0.5;
            var phidotdot = k * MathUtils.mod(this.gamma - 2 * phi) - d * phidot;
            return [zdot, 0.4 * zdotdot, thetadot, thetadotdot, phidot, phidotdot];
        };
        Head.prototype.length = function () {
            return 6;
        };
        Head.prototype.setAcceleration = function (accelertion) {
            this.acceleration = accelertion;
        };
        Head.prototype.setEulers = function (alpha, beta, gamma) {
            this.alpha = alpha;
            this.beta = beta;
            this.gamma = gamma;
        };
        Head.prototype.rollEyes = function () {
            if (this.eyeState != EyeState.Stopped)
                return;
            this.eyeState = EyeState.Started;
            this._rollEyes(this, 0)();
        };
        Head.prototype.stopEyes = function () {
            this.eyeState = EyeState.Stop;
        };
        Head.prototype._rollEyes = function (that, time, stopTime, vertical) {
            if (stopTime === void 0) { stopTime = -1; }
            if (vertical === void 0) { vertical = false; }
            return function () {
                var x = that.radius * Math.cos(time);
                var y = that.radius * Math.sin(time);
                switch (that.eyeState) {
                    case EyeState.Started:
                        if (time < Math.PI / 2) {
                            x = x * Math.sin(time);
                            y = y * Math.sin(time);
                        }
                        break;
                    case EyeState.Stop:
                        stopTime = time;
                        that.eyeState = EyeState.Fading;
                        break;
                    case EyeState.Fading:
                        if ((time - stopTime) < Math.PI / 2) {
                            x = x * Math.cos(time - stopTime);
                            y = y * Math.cos(time - stopTime);
                        }
                        else {
                            that.eyeState = EyeState.Stopped;
                            return;
                        }
                        break;
                }
                that.locLeftEye.setLocation(vertical ? 0 : x, y);
                that.locRightEye.setLocation(vertical ? 0 : x, y);
                setTimeout(that._rollEyes(that, time + 0.1, stopTime), 17);
            };
        };
        return Head;
    })();
    Solver.Head = Head;
})(Solver || (Solver = {}));
