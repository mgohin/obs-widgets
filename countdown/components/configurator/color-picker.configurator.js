export class ColorPickerConfigurator extends HTMLElement {

    _shadow;
    _colorInputEl;

    constructor() {
        super();
        this._shadow = this.attachShadow({mode : 'closed' });
        this._colorInputEl = this._createInput();
        this._shadow.append(this._colorInputEl);
    }

    _createInput() {
        const el = document.createElement('input');
        el.setAttribute('type', 'color');
        el.addEventListener('input', ev => {
           this.dispatchEvent(new CustomEvent('change', {detail: {color: ev.target.value}}));
        });
        return el;
    }

    static get observedAttributes() {
        return ['color'];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (property === 'color') {
            this._colorInputEl.setAttribute('value', newValue ?? '#000');
        }
    }
}

window.customElements.define('obs-countdown-configurator-color-picker', ColorPickerConfigurator);
