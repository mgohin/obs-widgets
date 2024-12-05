import {getDefaultUnits} from '../../../../common/units.js';
import {UnitConfigurationList} from '../../../../common/model/unit-configuration.model.js';

const BaseCss = `

   .unit-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
   }

   label { 
        user-select: none;
   }
   
   label:hover {
        cursor: pointer;
   }
   
   .unit-label {
        width: 7rem;
   }
   
   .copy-color-buttons {
        display: flex;
        flex-direction: column;
   }
   
   .copy-color-button {
        display: inline;
   }
   
   .override-all-colors {
        display: flex;
        flex-direction: column;
   }
`;

export class UnitsConfigurator extends HTMLElement {

    _shadow;
    _unitStates = getDefaultUnits();
    _overrideColors = {
        timeColor: '#000',
        unitColor: '#000'
    };

    constructor() {
        super();
        this._shadow = this.attachShadow({mode: 'closed'});
        const css = document.createElement('style');
        css.textContent = BaseCss;
        this._shadow.appendChild(css);

        this._createUnitElements();
        this._bindElements();
        this._updateElements();
    }

    static get observedAttributes() {
        return ['units'];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (property === 'units') {
            this._unitStates = UnitConfigurationList.fromAttribute(newValue);
            this._updateElements();
            this._dispatchChange();
        }
    }

    _createUnitElements() {
        this._shadow.append(...
            this._unitStates
                .map(unit => this._createUnitElement(unit))
        );

        const html = `
            <div class="unit-label"><!--spacer--></div>
            <div class="override-all-colors">
                <button class="copy-color-button override-time-colors">↑</button>
                <obs-countdown-configurator-color-picker class="color-picker-time"></obs-countdown-configurator-color-picker>
            </div>
            <div class="copy-color-buttons">
                <button class="copy-color-button copy-color-from-time-to-unit">→</button>
                <button class="copy-color-button copy-color-from-unit-to-time">←</button>
            </div>
            <div class="override-all-colors">
                <button class="copy-color-button override-unit-colors">↑</button>
                <obs-countdown-configurator-color-picker class="color-picker-unit"></obs-countdown-configurator-color-picker>
            </div>
        `;
        const overrideContainerEl = document.createElement('div');
        overrideContainerEl.classList.add('unit-container');
        overrideContainerEl.innerHTML = html;

        // override time colors
        const timeColorPickerEl = overrideContainerEl.querySelector('obs-countdown-configurator-color-picker.color-picker-time');
        timeColorPickerEl.addEventListener('change', ev => {
            this._overrideColors.timeColor = ev.detail.color;
        });
        overrideContainerEl.querySelector('button.override-time-colors')
            .addEventListener('click', () => {
                this._unitStates.forEach(s => s.timeColor = this._overrideColors.timeColor);
                this._updateElements();
                this._dispatchChange();
            });

        // switch colors
        overrideContainerEl.querySelector('button.copy-color-from-time-to-unit')
            .addEventListener('click', () => {
                this._overrideColors.unitColor = this._overrideColors.timeColor;
                unitColorPickerEl.setAttribute('color', this._overrideColors.unitColor);
            });

        overrideContainerEl.querySelector('button.copy-color-from-unit-to-time')
            .addEventListener('click', () => {
                this._overrideColors.timeColor = this._overrideColors.unitColor;
                timeColorPickerEl.setAttribute('color', this._overrideColors.timeColor);
            });

        // override unit colors
        const unitColorPickerEl = overrideContainerEl.querySelector('obs-countdown-configurator-color-picker.color-picker-unit');
        unitColorPickerEl.addEventListener('change', ev => {
            this._overrideColors.unitColor = ev.detail.color;
        });
        overrideContainerEl.querySelector('button.override-unit-colors')
            .addEventListener('click', () => {
                this._unitStates.forEach(s => s.unitColor = this._overrideColors.unitColor);
                this._updateElements();
                this._dispatchChange();
            });

        this._shadow.append(overrideContainerEl);
    }

    _createUnitElement(unitState) {
        const {unit} = unitState;
        const containerElId = this._computeContainerElementId(unit);
        const checkboxElId = this._computeCheckboxElementId(unit);
        const html = `
            <label for="${checkboxElId}" class="unit-label">
                <input type="checkbox" id="${checkboxElId}"> ${unit}
            </label>
            
            <obs-countdown-configurator-color-picker class="color-picker-time"></obs-countdown-configurator-color-picker>
            <div class="copy-color-buttons">
                <button class="copy-color-button copy-color-from-time-to-unit">→</button>
                <button class="copy-color-button copy-color-from-unit-to-time">←</button>
            </div>
            <obs-countdown-configurator-color-picker class="color-picker-unit"></obs-countdown-configurator-color-picker>
            
            <input type="text" class="unit-name" />
        `;

        const containerEl = document.createElement('div');
        containerEl.setAttribute('id', containerElId);
        containerEl.classList.add('unit-container');
        containerEl.innerHTML = html;

        containerEl.querySelector('button.copy-color-from-time-to-unit')
            .addEventListener('click', () => {
                const unitState = this._getUnitState(unit);
                unitState.copyTimeColorToUnit();
                this._updateElement(unitState);
                this._dispatchChange();
            });

        containerEl.querySelector('button.copy-color-from-unit-to-time')
            .addEventListener('click', () => {
                const unitState = this._getUnitState(unit);
                unitState.copyUnitColorToTime();
                this._updateElement(unitState);
                this._dispatchChange();
            });

        return containerEl;
    }

    _bindElements() {
        this._unitStates.forEach(unitState => this._bindElement(unitState));
    }

    _bindElement(unitState) {
        this._getCheckboxEl(unitState.unit).addEventListener('change', ev => {
            this._updateCheckbox(this._getUnitState(unitState.unit).unit, ev.target.checked);
            this._dispatchChange();
        });

        this._getTimeColorPickerEl(unitState.unit).addEventListener('change', ev => {
            this._getUnitState(unitState.unit).timeColor = ev.detail.color;
            this._dispatchChange();
        });

        this._getUnitColorPickerEl(unitState.unit).addEventListener('change', ev => {
            this._getUnitState(unitState.unit).unitColor = ev.detail.color;
            this._dispatchChange();
        });

        this._getInputUnitNameEl(unitState.unit).addEventListener('input', ev => {
            this._getUnitState(unitState.unit).name = ev.target.value;
            this._dispatchChange();
        });
    }

    _getUnitState(unit) {
        return this._unitStates.find(s => s.unit === unit);
    }

    _updateElements() {
        this._unitStates.forEach(unitState => this._updateElement(unitState));
    }

    _updateElement(unitState) {
        const checkboxEl = this._getCheckboxEl(unitState.unit);
        checkboxEl.checked = unitState.visible;

        const colorPickerTimeEl = this._getTimeColorPickerEl(unitState.unit);
        colorPickerTimeEl.setAttribute('color', unitState.timeColor);

        const colorPickerUnitEl = this._getUnitColorPickerEl(unitState.unit);
        colorPickerUnitEl.setAttribute('color', unitState.unitColor);

        const nameEl = this._getInputUnitNameEl(unitState.unit);
        nameEl.value = unitState.name;
    }

    _getContainerEl(unit) {
        const containerElId = this._computeContainerElementId(unit);
        return this._shadow.getElementById(containerElId);
    }

    _getCheckboxEl(unit) {
        return this._shadow.getElementById(this._computeCheckboxElementId(unit));
    }

    _getTimeColorPickerEl(unit) {
        return this._getContainerEl(unit).querySelector('obs-countdown-configurator-color-picker.color-picker-time');
        // return this._getContainerEl(unit).getElementsByTagName('obs-countdown-configurator-color-picker')[0];
    }

    _getUnitColorPickerEl(unit) {
        return this._getContainerEl(unit).querySelector('obs-countdown-configurator-color-picker.color-picker-unit');
        // return this._getContainerEl(unit).getElementsByTagName('obs-countdown-configurator-color-picker')[1];
    }

    _getInputUnitNameEl(unit) {
        return this._getContainerEl(unit).querySelector('input.unit-name');
    }

    _computeContainerElementId(unit) {
        return `unit-${unit}`;
    }

    _computeCheckboxElementId(unit) {
        return `chk-${this._computeContainerElementId(unit)}`;
    }

    _updateCheckbox(unit, checked) {
        const unitState = this._unitStates.find(s => s.unit === unit);
        unitState.visible = checked;

        const inputEl = this._shadow.getElementById(this._computeContainerElementId(unit));
        inputEl.checked = checked;
    }

    _dispatchChange() {
        this.dispatchEvent(new CustomEvent('change', {detail: {activeUnits: this._unitStates}}));
    }
}

window.customElements.define('obs-countdown-configurator-units', UnitsConfigurator);
