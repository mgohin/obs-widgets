import {UnitConfiguration, UnitConfigurationList} from './model/unit-configuration.model.js';

export function getUnitKeys() {
    return ['days', 'hours', 'minutes', 'seconds'];
}

export function getDefaultUnits() {
    return UnitConfigurationList.from(getUnitKeys().map(unit => new UnitConfiguration(unit, '#AE3232', '#AE3232', true, unit)));
}

export function parseUnitsOrGetDefaults(attributeValue) {
    if (!attributeValue) return getDefaultUnits();

    return UnitConfigurationList.fromAttribute(attributeValue);
}