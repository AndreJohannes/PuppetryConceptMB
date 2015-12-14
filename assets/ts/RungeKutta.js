var RungeKutta;
(function (RungeKutta) {
    var RungeKuttaSolver4th = (function () {
        function RungeKuttaSolver4th(funct) {
            this.function = funct;
        }
        RungeKuttaSolver4th.prototype.solve = function (state, stepSize) {
            var k1 = this.function.evaluate(state);
            var k2 = this.function.evaluate(this.add(state, this.scale(k1, stepSize / 2.0)));
            var k3 = this.function.evaluate(this.add(state, this.scale(k2, stepSize / 2.0)));
            var k4 = this.function.evaluate(this.add(state, this.scale(k3, stepSize)));
            return this.add(state, this.scale(this.add(this.scale(this.add(k2, k3), 2.0), this.add(k1, k4)), stepSize / 6.0));
        };
        RungeKuttaSolver4th.prototype.add = function (a, b) {
            var retArray = [];
            for (var i = 0; i < a.length; i++) {
                retArray.push(a[i] + b[i]);
            }
            return retArray;
        };
        RungeKuttaSolver4th.prototype.scale = function (a, factor) {
            var retArray = [];
            for (var i = 0; i < a.length; i++) {
                retArray.push(a[i] * factor);
            }
            return retArray;
        };
        return RungeKuttaSolver4th;
    })();
    RungeKutta.RungeKuttaSolver4th = RungeKuttaSolver4th;
})(RungeKutta || (RungeKutta = {}));
