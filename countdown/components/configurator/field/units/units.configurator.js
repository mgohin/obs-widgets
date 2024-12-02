import {getDefaultUnits, getUnitKeys, UnitConfiguration, UnitConfigurationList} from '../../../../common/units.js';

const BaseCss = `
   
   label { 
    user-select: none;
   }
   
   label:not(:last-child) {
    margin-right: 1rem;
   }
   
   label:hover {
    cursor: pointer;
   }
`;

export class UnitsConfigurator extends HTMLElement {

    _shadow;
    _unitStates = getDefaultUnits();

    constructor() {
        super();
        this._shadow = this.attachShadow({mode: 'closed'});
        const css = document.createElement('style');
        css.textContent = BaseCss;
        this._shadow.appendChild(css);

        const inputs = this._createInputs();
        this._shadow.append(...inputs);
    }

    static get observedAttributes() {
        return ['checked-units'];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (property === 'checked-units') {
            const units = UnitConfigurationList.fromAttribute(newValue);
            this._unitStates.forEach(unitConfig => {
                this._updateCheckbox(unitConfig.unit, unitConfig.visible);
            });
            this._dispatchChange();
        }
    }

    _createInputs() {
        return this._unitStates
            .map(unit => this._createInput(unit));
    }

    _createInput(unitState) {
        const containerEl = document.createElement('div');

        const inputElId = this._computeCheckboxId(unitState.unit);

        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', inputElId);

        const inputEl = document.createElement('input');
        inputEl.setAttribute('id', inputElId);
        inputEl.setAttribute('type', 'checkbox');
        inputEl.addEventListener('change', ev => {
            this._updateCheckbox(unitState.unit, ev.target.checked);
            this._dispatchChange();
        });

        labelEl.appendChild(inputEl);
        labelEl.append(unitState.unit);

        containerEl.appendChild(labelEl);

        const colorPickerEl = document.createElement('obs-countdown-configurator-color-picker');
        colorPickerEl.addEventListener('change', ev => {
            const unitState = this._unitStates.find(s => s.unit === unit);
            unitState.color = ev.detail.color;
            this._dispatchChange();
        });
        colorPickerEl.setAttribute('color', '#CE3B3B');

        return containerEl;
    }

    _computeCheckboxId(unit) {
        return `unit-${unit}`;
    }

    _updateCheckbox(unit, checked) {
        const unitState = this._unitStates.find(s => s.unit === unit);
        unitState.visible = checked;

        const inputEl = this._shadow.getElementById(this._computeCheckboxId(unit));
        inputEl.checked = checked;
    }

    _dispatchChange() {
        this.dispatchEvent(new CustomEvent('change', {detail: {activeUnits: this._unitStates}}));
    }
}

window.customElements.define('obs-countdown-configurator-units', UnitsConfigurator);
