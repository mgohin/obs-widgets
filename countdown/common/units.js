export function getUnits() {
    return ['days', 'hours', 'minutes', 'secondes'];
}

export function extractUnitsFromAttribute(attributeValue) {
    const units = attributeValue.split(/[\s;,]/).map(unit => unit.trim());
    return getUnits()
        .filter(unit => unit.length > 0 && units.includes(unit));
}