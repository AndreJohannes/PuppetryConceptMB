var MathUtils;
(function (MathUtils) {
    function mod(value) {
        var ret = value % (2 * Math.PI);
        if (ret > Math.PI)
            return ret - 2 * Math.PI;
        if (ret < (-Math.PI))
            return ret + 2 * Math.PI;
        return ret;
    }
    MathUtils.mod = mod;
    function tanh(x) {
        return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
    }
    MathUtils.tanh = tanh;
    function len(vector) {
        var retValue = 0;
        for (var key in vector) {
            retValue += Math.pow(vector[key], 2);
        }
        return Math.sqrt(retValue);
    }
    MathUtils.len = len;
})(MathUtils || (MathUtils = {}));
