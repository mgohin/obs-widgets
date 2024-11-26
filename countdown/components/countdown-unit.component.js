const BaseCss = `
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-rendering: optimizeLegibility;
                font-size: 5rem;
            }
            
            .time {
                font-size: 1.5em;
                font-weight: bold;
            }
            
            .unit {
                font-size: 0.75em;
            }
`;

export class CountdownUnit extends HTMLElement {

    _shadow;
    _unit;
    _remainingTimeInMs = 0;
    _timeEl;
    _unitEl;

    constructor() {
        super();
        this._timeEl = document.createElement('div');
        this._timeEl.classList.add('time');
        this._unitEl = document.createElement('div');
        this._unitEl.classList.add('unit');

        this._shadow = this.attachShadow({mode : 'closed' }) ;
        const css = document.createElement('style');
        css.textContent = BaseCss;
        this._shadow.appendChild(css);

        this._shadow.appendChild(this._timeEl);
        this._shadow.appendChild(this._unitEl);
    }

    static get observedAttributes() {
        return ['remaining-time-in-ms', 'unit', 'text-color'];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (property === 'unit') {
            this._unit = newValue;
            this._unitEl.textContent = newValue.substr(0, 1).toUpperCase();
        } else if (property === 'remaining-time-in-ms') {
            this._remainingTimeInMs = Number(newValue);
            this._updateView();
        } else if (property === 'text-color') {
            this._shadow.host.style.color = newValue;
        }
    }

    _updateView() {
        const totalSecondes = this._remainingTimeInMs / 1000;
        const divisor = this._unit === 'secondes' ? 1 : this._unit === 'minutes' ? 60 : this._unit === 'hours' ? 60 * 60 : 60 * 60 * 24;
        const modulo = this._unit === 'secondes' ? 60 : this._unit === 'minutes' ? 60 : this._unit === 'hours' ? 24 : 1;
        const value = Math.floor(totalSecondes / divisor) % modulo;
        this._timeEl.textContent = `${value < 10 ? '0' : ''}${value}`;
    }
}

window.customElements.define('obs-countdown-unit', CountdownUnit);
