export class UnitConfiguration {
    unit;
    color;
    visible;
    name;

    constructor(unit, color, visible, name) {
        this.unit = unit;
        this.color = color;
        this.visible = visible;
        this.name = name;
    }

    static fromAttribute(value) {
        if (!value) return null;
        const [unit, color, visible, name] = value.split(':');
        return new UnitConfiguration(unit, color, visible === 'true', name);
    }

    toAttribute() {
        return [this.unit, this.color, this.visible, this.name].join(':');
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

export function getUnitKeys() {
    return ['days', 'hours', 'minutes', 'seconds'];
}

export function getDefaultUnits() {
    return UnitConfigurationList.from(getUnitKeys().map(unit => new UnitConfiguration(unit, 'red', true, unit)));
}

export function extractUnitsFromAttribute(attributeValue) {
    if (!attributeValue) return null;

    const units = attributeValue.split(/[\s;,]/).map(unit => unit.trim());
    return getUnitKeys()
        .filter(unit => unit.length > 0 && units.includes(unit));
}