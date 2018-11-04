export default class Length {
    constructor (value, unit) {
        this.value = value;
        this.unit = unit;
    }

    toString () {
        return this.value + this.unit.name;
    }

    convertTo (thatunit) {
        const factor = this.unit.factor / thatunit.factor;
        return new Length (this.value * factor, thatunit)
    }
}

Length.KM = {name: "km", factor: 1000}
Length.M  = {name: "m" , factor: 1}
Length.CM = {name: "cm", factor: 0.01}
Length.MM = {name: "cm", factor: 0.001}
Length.UNITS = [Lenth.KM, Lenght.M, Length.CM, Length.MM]
