import {CodeCss} from '../common/css/code.css.js';
import {UnitConfigurationList} from '../common/model/unit-configuration.model.js';

const BaseCss = `
    :host {
        display: inline-grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 1rem;
    }
    
   ${CodeCss}
`;


class Countdown extends HTMLElement {
    _shadow;
    _toDate = null;
    _textColor;
    _updateCountDownInterval = null;
    _diffInMs = 0;
    _timeEls = [];

    constructor() {
        super();
        this._shadow = this.attachShadow({mode : 'closed' }) ;
        const css = document.createElement('style');
        css.textContent = BaseCss;
        this._shadow.appendChild(css);
    }

    static get observedAttributes() {
        return ['date', 'units', 'text-color'];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (property === 'date') {
            this._updatePropertyDate(newValue);
        } else if (property === 'units') {
            this._updatePropertyUnits(newValue);
        } else if(property === 'text-color') {
            this._textColor = newValue;
            this._timeEls.forEach(el => el.setAttribute('text-color', newValue));
        }
    }

    connectedCallback() {
        this._resetTimeElements();
    }

    _updatePropertyDate(newValue) {
        this._toDate = new Date(newValue);
        this._updateInterval();
    }

    _updatePropertyUnits(newValue) {
        const unitConfigurations = UnitConfigurationList.fromAttribute(newValue);
        this._timeEls = unitConfigurations
            .filter(unitConfiguration => unitConfiguration.visible)
            .map(unitConfiguration => {
                const el = document.createElement('obs-countdown-unit');
                el.setAttribute('unit', unitConfiguration.toAttribute());
                return el;
            });
        this._resetTimeElements();
    }

    _resetTimeElements() {
        Array.from(this._shadow.childNodes)
            .filter(node => node.nodeName !== 'STYLE')
            .forEach(el => el.remove());

        if (!this._toDate || isNaN(this._toDate.getTime())) {
            const futureDate = new Date();
            futureDate.setTime(futureDate.getTime() + 2 * 60 * 60 * 1000);
            const el = document.createElement('p');
            el.innerHTML = `Date limite non définie, veuillez modifier le paramètre <code>date</code> du composant, par exemple <code>&lt;obs-countdown date="${futureDate.toISOString()}" /&gt;</code>`;
            this._shadow.append(el);
        } else {
            this._timeEls.forEach(el => this._shadow.appendChild(el));
            this._updateView();
        }
    }

    _updateView() {
        this._timeEls.forEach(el => el.setAttribute('remaining-time-in-ms', this._diffInMs));
    }

    _updateInterval() {
        if (!this._updateCountDownInterval) {
            this._updateCountDownInterval = setInterval(() => {
                const now = new Date();
                this._diffInMs = Math.max(0, this._toDate.getTime() - now.getTime());
                if (!this._diffInMs) {
                    clearInterval(this._updateCountDownInterval);
                    this._updateCountDownInterval = null;
                }
                this._updateView();
            }, 200);
        }
    }
}

window.customElements.define('obs-countdown', Countdown);
