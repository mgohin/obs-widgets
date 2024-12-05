import {getDefaultUnits} from '../../../../common/units.js';
import {UnitConfigurationList} from '../../../../common/model/unit-configuration.model.js';

const BaseCss = `
    .url-date {
        color: red;
    }
    
    .url-units {
        color: green;
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
        return ['units', 'date'];
    }

    _createUrlEl() {
        return document.createElement('p');
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (property === 'units') {
            this._data.units = UnitConfigurationList.fromAttribute(newValue);
        } else {
            this._data[property] = newValue;
        }
        this._updateUrl();
    }

    _updateUrl() {
        const params = [
            {key: 'date', value: this._data.date},
            {key: 'units', value: this._data.units.toAttribute()}
        ];
        const visibleUrlParams = params
            .map(param => `<span class="url-${param.key}">${param.key}=${encodeURIComponent(param.value)}</span>`)
            .join('&');

        const newUrl = `${window.location.origin}${window.location.pathname}?${visibleUrlParams}`;
        if (newUrl === this._urlEl) return;

        this._url = newUrl;
        this._urlEl.innerHTML = this._url;

        const searchParams = new URLSearchParams(window.location.search);
        params.forEach(param => searchParams.set(param.key, param.value));
        window.history.replaceState(null, null, '?' + searchParams.toString());
        this.dispatchEvent(new CustomEvent('change', {detail: {data: this._data}}));
    }
}

window.customElements.define('obs-countdown-configurator-widget-url', WidgetUrlConfigurator);
