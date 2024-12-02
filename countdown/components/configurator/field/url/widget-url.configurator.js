import {getDefaultUnits, getUnitKeys, UnitConfigurationList} from '../../../../common/units.js';

const BaseCss = `
    .url-date {
        color: red;
    }
    
    .url-units {
        color: green;
    }
    
    .url-text-color {
        color: blue;
    }
`;

export class WidgetUrlConfigurator extends HTMLElement {

    _shadow;
    _url;
    _data = {
        date: null,
        textColor: null,
        units: getDefaultUnits()
    };

    constructor() {
        super();
        this._shadow = this.attachShadow({mode: 'closed'});
        const css = document.createElement('style');
        css.textContent = BaseCss;
        this._shadow.appendChild(css);

        this._urlEl = this._createUrlEl();
        this._shadow.append(this._urlEl);
    }

    static get observedAttributes() {
        return ['text-color', 'units', 'date'];
    }

    _createUrlEl() {
        return document.createElement('p');
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        if(property === 'text-color') {
            this._data.textColor = newValue;
        } else if(property === 'units') {
            this._data.units = UnitConfigurationList.fromAttribute(newValue)
        } else {
            this._data[property] = newValue;
        }
        this._updateUrl();
    }

    _updateUrl() {
        const params = [
            `<span class="url-date">date=${this._data.date}</span>`,
            `<span class="url-text-color">text-color=${this._data.textColor}</span>`,
            `<span class="url-units">units=${this._data.units.toAttribute()}</span>`
        ].join('&');
        const newUrl = `${window.location.origin}${window.location.pathname}?${params}`;
        if (newUrl === this._urlEl) return;

        this._url = newUrl;
        this._urlEl.innerHTML = this._url;
        this.dispatchEvent(new CustomEvent('change', {detail: {data: this._data}}));
    }
}

window.customElements.define('obs-countdown-configurator-widget-url', WidgetUrlConfigurator);
