export class UnitConfiguration {
    unit;
    timeColor;
    unitColor;
    visible;
    name;

    constructor(unit, timeColor, unitColor, visible, name) {
        this.unit = unit;
        this.timeColor = timeColor;
        this.unitColor = unitColor;
        this.visible = visible;
        this.name = name;
    }

    static fromAttribute(value) {
        if (!value) return null;
        const [unit, timeColor, unitColor, visible, name] = value.split(':');
        return new UnitConfiguration(unit, timeColor, unitColor, visible === 'true', name);
    }

    toAttribute() {
        return [this.unit, this.timeColor, this.unitColor, this.visible, this.name].join(':');
    }

    copyTimeColorToUnit() {
        this.unitColor = this.timeColor;
    }

    copyUnitColorToTime() {
        this.timeColor = this.unitColor;
    }
}

export class UnitConfigurationList extends Array {

    static from(arr) {
        return new UnitConfigurationList(...arr);
    }

    static fromAttribute(value) {
        if (!value) return null;
        const array = Array.from(value.split('|'));
        return UnitConfigurationList.from(array.map(unitAttr => UnitConfiguration.fromAttribute(unitAttr)));
    }


    toAttribute() {
        return this.map(unit => unit.toAttribute()).join('|');
    }
}