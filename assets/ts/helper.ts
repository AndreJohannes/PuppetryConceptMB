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

}