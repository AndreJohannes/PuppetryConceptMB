module MathUtils {

    export function mod(value: number): number {
        var ret = value % (2 * Math.PI);
        if (ret > Math.PI)
            return ret - 2 * Math.PI;
        if (ret < (-Math.PI))
            return ret + 2 * Math.PI;
        return ret;
    }

    export function tanh(x: number): number {
        return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x))
    }

    export function len(vector: number[]):number {
        var retValue: number = 0;
        for (var key in vector) {
            retValue += vector[key] ** 2;
        }
        return Math.sqrt(retValue);
    }

}