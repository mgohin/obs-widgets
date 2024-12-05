import {parseUnitsOrGetDefaults} from '../../common/units.js';

class Configurator extends HTMLElement {

    _countdownEl;
    _widgetUrlEl;

    constructor() {
        super();
        this.innerHTML = `
            <div class="render-view">
                <obs-countdown id="countdown" class="render-view"></obs-countdown>
            </div>
           <fieldset>
                <legend>Configurator <button onclick="event.stopPropagation(); toggleRenderView(true)">Close</button></legend>
               <p>Use this form to configure your widget url</p>
            </fieldset>
            <fieldset>
                <legend>Widget url</legend>
                <obs-countdown-configurator-widget-url id="widget-url"></obs-countdown-configurator-widget-url>
            </fieldset>
            <fieldset>
                <legend>Select units you want to see</legend>
                <obs-countdown-configurator-units></obs-countdown-configurator-units>
            </fieldset>
        `;
        this._countdownEl = document.getElementById('countdown');
        const conf = this._extractUrlParamsOrDefaultValues();
        this._initWidgetUrl(conf);
        this._initUnitsConfigurator(conf.units);
    }

    _extractUrlParamsOrDefaultValues() {
        const searchParams = new URLSearchParams(window.location.search);
        const date = searchParams.get('date') ?? null;
        const units = parseUnitsOrGetDefaults(searchParams.get('units'));
        return {date, units};
    }

    _initWidgetUrl(conf) {
        this._widgetUrlEl = document.getElementById('widget-url');
        this._widgetUrlEl.addEventListener('change', ev => {
            this._updateCountdown(ev.detail.data);
        });

        if (conf.date !== null) {
            this._widgetUrlEl.setAttribute('date', conf.date);
        }
    }

    _updateCountdown(data) {
        this._countdownEl.setAttribute('date', data.date);
        this._countdownEl.setAttribute('units', data.units.toAttribute());
    }

    _initUnitsConfigurator(units) {
        const configuratorUnitsEl = this.getElementsByTagName('obs-countdown-configurator-units')[0];
        configuratorUnitsEl.addEventListener('change', ev => {
            this._widgetUrlEl.setAttribute('units', ev.detail.activeUnits.toAttribute());
        });
        configuratorUnitsEl.setAttribute('units', units.toAttribute());
    }
}

window.customElements.define('obs-configurator', Configurator);